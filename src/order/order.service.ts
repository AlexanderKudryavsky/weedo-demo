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

    console.log(222222, productsWithAmount);

    const totalPrice = productsWithAmount.reduce((prev, acc) => {
      return prev + (acc.price * acc.amount);
    }, 0);

    console.log(33333333, totalPrice);

    const order = await this.orderModel.create({
      user: createOrderDto.userId,
      courier: null,
      products: productsWithAmount.map(product => ({
        amount: product.amount,
        product: new Types.ObjectId(product._id),
      })),
      // products: createOrderDto.products,
      totalPrice,
      status: OrderStatuses.Placed,
      rejectReason: null,
    });

    // await this.cartModel.findByIdAndUpdate(cart._id, { status: CartStatuses.Ordered }).exec();

    // await this.userModel.findByIdAndUpdate(cart.userId, { currentCart: null }).exec();

    return order;
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: string) {
    return `This action returns a #${id} order`;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.orderModel.findByIdAndUpdate(id, {status: updateOrderStatusDto.status}).exec()
    this.websocketsGateway.sendStatus({orderId: id, status: updateOrderStatusDto.status})
    return order;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
