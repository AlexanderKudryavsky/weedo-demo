import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/entities/user.entity";
import * as mongoose from "mongoose";
import { Transform, Type } from "class-transformer";
import { Cart } from "../../cart/entities/cart.entity";
import { Product } from "../../product/entities/product.entity";

export enum OrderStatuses {
  Placed = 'Placed',
  Confirmed = 'Confirmed',
  WaitingForPickUp = 'WaitingForPickUp',
  OnTheWay = 'OnTheWay',
  Completed = 'Completed',
  Canceled = 'Canceled',
}

@Schema({_id: false})
export class OrderProductsSchema {
  @ApiProperty()
  @Prop()
  amount: number;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Product.name})
  product: string;
}

@Schema({ timestamps: true})
export class Order {
  @ApiProperty()
  @Type(() => String)
  @Transform(({ value }) => value.toString())
  _id: string;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Cart.name})
  cartId: Cart;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
  userId: User;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
  courierId: User;

  @ApiProperty({type: OrderProductsSchema, isArray: true})
  @Prop([{type: OrderProductsSchema}])
  products: OrderProductsSchema;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.Number})
  totalPrice: number;

  @ApiProperty({enum: OrderStatuses})
  @Prop({type: mongoose.Schema.Types.String, enum: OrderStatuses})
  status: OrderStatuses;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  rejectReason: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
