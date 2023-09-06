import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, PipelineStage, Schema, Types } from "mongoose";
import { Order, OrderStatuses } from "./entities/order.entity";
import { User } from "../users/entities/user.entity";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { WebsocketsGateway } from "../helpers/websockets.gateway";
import { Product } from "../product/entities/product.entity";
import { OrdersFilter, PaginationResult, StoreReport } from "../helpers/types";
import { HttpService } from "@nestjs/axios";
import { BotTypes } from "../stores/dto/assign-bot.dto";
import { Store } from "../stores/entities/store.entity";
import { AssignCourierDto } from "./dto/assign-courier.dto";
import axios from 'axios';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Store.name) private storeModel: Model<Store>,
    @Inject(WebsocketsGateway) private websocketsGateway: WebsocketsGateway,
    private httpService: HttpService
  ) {
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const DEFAULT_DELIVERY_PRICE = 10000;

    const products = await this.productModel.find({
      _id: {
        $in: createOrderDto.products.map(product => product.productId)
      }
    }).lean().exec();

    const storeId = products[0].store;

    const store = await this.storeModel.findById(storeId).lean().exec();

    if (!store.botType) {
      throw new BadRequestException("Bot is not assigned to store");
    }

    const productsWithAmount = products.map(product => {
      const amount = createOrderDto.products.find(productObj => productObj.productId === product._id.toString()).amount;
      return {
        ...product,
        amount,
        serviceCommission: (product.price * ((product.commission || store.commission) / 100)) * amount,
        storeProfit: (product.price * ((100 - (product.commission || store.commission)) / 100)) * amount,
        totalPrice: product.price * amount,
      };
    });

    const totalPrice = productsWithAmount.reduce((prev, acc) => {
      return prev + ((acc.price) * acc.amount);
    }, 0);

    const deliveryPrice = totalPrice >= 150000 ? 0 : DEFAULT_DELIVERY_PRICE;

    const price = {
      serviceCommission: productsWithAmount.reduce((prev, acc) => {
        return prev + acc.serviceCommission;
      }, 0),
      storeProfit: productsWithAmount.reduce((prev, acc) => {
        return prev + acc.storeProfit;
      }, 0),
      deliveryPrice,
    };

    const ordersCount = await this.orderModel.count({store: store._id}).exec();

    const order = await this.orderModel.create({
      number: ordersCount + 1,
      user: createOrderDto.userId,
      store: storeId,
      courier: null,
      products: productsWithAmount.map(product => ({
        amount: product.amount,
        serviceCommission: product.serviceCommission,
        storeProfit: product.storeProfit,
        totalPrice: product.totalPrice,
        product: new Types.ObjectId(product._id)
      })),
      price,
      totalPrice: totalPrice + deliveryPrice,
      status: OrderStatuses.Placed,
      rejectReason: null
    });

    await order.populate(["user", "courier", "store", "products.product"]);

    const botsMapper = {
      [BotTypes.Telegram]: this.sendOrderToTelegramBot,
      [BotTypes.Line]: this.sendOrderToLineBot
    };

    await botsMapper[order.store.botType](order);

    return order;
  }

  async sendOrderToTelegramBot(order: Order) {
    console.log("Send order to Telegram");

    const botBaseUrl = 'https://nodejs-production-92d4.up.railway.app';

    await axios.post(`${botBaseUrl}/tg/order`, order);

    return;
  };

  async sendOrderToLineBot(order: Order) {
    console.log("Send order to Line");

    return;
  };

  async findAll({ status, limit, offset }): Promise<PaginationResult<Order>> {
    const filter: FilterQuery<OrdersFilter> = {};

    if (status) {
      filter.status = status;
    }

    console.log(111111, filter);

    const totalCount = await this.orderModel.find(filter).count().exec();
    const results = await this.orderModel.find(filter, {}, {
      limit,
      skip: offset
    })
      .sort({ "createdAt": 1 })
      .populate(["user", "courier", "store", "products.product"])
      .exec();

    console.log(22222222, results)

    return {
      totalCount,
      results
    };
  }

  findOne(id: string) {
    return this.orderModel.findById(id).populate(["user", "courier", "store", "products.product"]).exec();
  }

  async findAllByUserId({ id, status, limit, offset }) {

    const filter: FilterQuery<OrdersFilter> = {
      user: id
    };

    if (status) {
      filter.status = status;
    }

    const totalCount = await this.orderModel.count(filter).exec();
    const results = await this.orderModel.find(filter, {}, {
      limit,
      skip: offset
    })
      .sort({ "createdAt": 1 })
      .populate(["user", "courier", "store", "products.product"])
      .exec();

    return {
      totalCount,
      results
    };
  }

  async findAllByStoreId({ limit, offset, id }) {
    const totalCount = await this.orderModel.find({ user: id }).count().exec();
    const results = await this.orderModel.find({ store: id }, {}, {
      limit,
      skip: offset
    })
      .sort({ "createdAt": 1 })
      .populate(["user", "courier", "store", "products.product"])
      .exec();

    return {
      totalCount,
      results
    };
  }

  async assignCourier(id: string, assignCourierDto: AssignCourierDto) {
    const order = await this.orderModel.findById(id).lean().exec();
    if (order.courier) {
      throw new BadRequestException('Courier already assigned');
    }
    const updatedOrder = await this.orderModel.findByIdAndUpdate(id, {courier: assignCourierDto.courierId}, {new: true}).populate(['courier']).exec();

    this.websocketsGateway.sendStatus({ orderId: updatedOrder._id, status: updatedOrder.status, courier: updatedOrder.courier });

    return updatedOrder;
  };

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.orderModel.findByIdAndUpdate(id, { status: updateOrderStatusDto.status }, {new: true}).populate(['user', 'courier']).exec();
    this.websocketsGateway.sendStatus({ orderId: id, status: updateOrderStatusDto.status, courier: order.courier });
    return order;
  }

  async getReport(storeId, { startDate, endDate }) {
    const aggregation: Array<PipelineStage> = [
      {
        $project: {
          storeProfit: "$price.storeProfit",
          number: "$number"
        }
      },
      {
        $group: {
          _id: null,
          totalStoreProfit: {
            $sum: "$storeProfit"
          },
          orders: {
            $push: "$$ROOT"
          }
        }
      }
    ];

    const match: PipelineStage = {
      $match: {
        store: new Types.ObjectId(storeId)
      }
    };

    if (startDate) {
      match.$match.createdAt = {
        ...match.$match.createdAt,
        $gte: new Date(startDate),
      }
    }

    if (endDate) {
      match.$match.createdAt = {
        ...match.$match.createdAt,
        $lte: new Date(endDate),
      }
    }

    aggregation.unshift(match);

    const result = await this.orderModel.aggregate(aggregation) as Array<StoreReport>;

    if (!result.length) {
      return {};
    }

    return result[0];
  }
}
