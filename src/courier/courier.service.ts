import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Order, OrderStatuses } from "../order/entities/order.entity";
import { FilterQuery, Model } from "mongoose";
import { OrdersFilter, PaginationResult } from "../helpers/types";

@Injectable()
export class CourierService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>
  ) {
  }

  async findAllAvailable(): Promise<PaginationResult<Order>> {
    const totalCount = await this.orderModel
      .count({
        courier: null,
        status: {
          $in: [OrderStatuses.Confirmed, OrderStatuses.WaitingForPickUp]
        }
      }).exec();

    const results = await this.orderModel
      .find({
        courier: null,
        status: {
          $in: [OrderStatuses.Confirmed, OrderStatuses.WaitingForPickUp]
        }
      })
      .sort("createdAt")
      .populate(["user", "courier", "store", "products.product"])
      .exec();

    return {
      totalCount,
      results
    };
  }

  async findAll({ courierId, status, limit, offset }): Promise<PaginationResult<Order>> {
    const filter: FilterQuery<OrdersFilter> = {
      courier: courierId,
    };

    if (status) {
      filter.status = status;
    }

    const totalCount = await this.orderModel.find(filter).count().exec();
    const results = await this.orderModel.find(filter, {}, {
      limit,
      skip: offset
    }).populate(["user", "courier", "store", "products.product"]).exec();

    return {
      totalCount,
      results
    };
  }
}
