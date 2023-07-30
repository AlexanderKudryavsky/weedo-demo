import { Inject, Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Order, OrderStatuses } from "./entities/order.entity";
import { Cart, CartStatuses } from "../cart/entities/cart.entity";
import { HttpException } from "@nestjs/common/exceptions/http.exception";
import { User } from "../users/entities/user.entity";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { WebsocketsGateway } from "../helpers/websockets.gateway";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(WebsocketsGateway) private websocketsGateway: WebsocketsGateway,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const cart = await this.cartModel.findById(createOrderDto.cartId).populate('products.product').exec();

    if (cart.status === CartStatuses.Ordered) {
      throw new HttpException('Cart was already ordered', 400);
    }

    const totalPrice = cart.products.reduce((prev, acc) => {
      return prev + (acc.product.price * acc.amount);
    }, 0);

    const order = await this.orderModel.create({
      cartId: cart._id,
      userId: cart.userId,
      courierId: null,
      products: cart.products.map(productObj => ({
        amount: productObj.amount,
        product: new Types.ObjectId(productObj.product._id),
      })),
      totalPrice,
      status: OrderStatuses.Placed,
      rejectReason: null,
    });

    await this.cartModel.findByIdAndUpdate(cart._id, { status: CartStatuses.Ordered }).exec();

    await this.userModel.findByIdAndUpdate(cart.userId, { currentCart: null }).exec();

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
