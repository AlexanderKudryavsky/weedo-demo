import { Inject, Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Order, OrderStatuses } from "./entities/order.entity";
import { User } from "../users/entities/user.entity";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { WebsocketsGateway } from "../helpers/websockets.gateway";
import { Product } from "../product/entities/product.entity";
import { PaginationResult } from "../helpers/types";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @Inject(WebsocketsGateway) private websocketsGateway: WebsocketsGateway,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const products = await this.productModel.find({_id: {
      $in: createOrderDto.products.map(product => product.productId)
    }}).lean().exec()

    const productsWithAmount = products.map(product => ({
      ...product,
      amount: createOrderDto.products.find(productObj => productObj.productId === product._id.toString()).amount
    }))

    const totalPrice = productsWithAmount.reduce((prev, acc) => {
      return prev + (acc.price * acc.amount);
    }, 0);

    const order = await this.orderModel.create({
      user: createOrderDto.userId,
      courier: null,
      products: productsWithAmount.map(product => ({
        amount: product.amount,
        product: new Types.ObjectId(product._id),
      })),
      totalPrice,
      status: OrderStatuses.Placed,
      rejectReason: null,
    });

    return order;
  }

  async findAll({ limit, offset }): Promise<PaginationResult<Order>> {
    const totalCount = await this.orderModel.find().count().exec()
    const results = await this.orderModel.find({}, {}, { limit, skip: offset }).populate(['user', 'courier', 'products.product']).exec();

    return {
      totalCount,
      results
    };
  }

  findOne(id: string) {
    return this.orderModel.findById(id).populate(['user', 'courier', 'products.product']).exec();
  }

  async findAllByUserId({ limit, offset, id }) {
    const totalCount = await this.orderModel.find({user: id}).count().exec()
    const results = await this.orderModel.find({user: id}, {}, { limit, skip: offset }).populate(['user', 'courier', 'products.product']).exec();

    return {
      totalCount,
      results
    };
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.orderModel.findByIdAndUpdate(id, {status: updateOrderStatusDto.status}).exec()
    this.websocketsGateway.sendStatus({orderId: id, status: updateOrderStatusDto.status})
    return order;
  }
}
