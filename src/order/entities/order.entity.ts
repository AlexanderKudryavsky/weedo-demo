import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/entities/user.entity";
import * as mongoose from "mongoose";
import { Transform, Type } from "class-transformer";
import { Product } from "../../product/entities/product.entity";
import { Store } from "../../stores/entities/store.entity";

export enum OrderStatuses {
  Placed = 'Placed',
  Confirmed = 'Confirmed',
  WaitingForPickUp = 'WaitingForPickUp',
  OnTheWay = 'OnTheWay',
  Completed = 'Completed',
  Canceled = 'Canceled',
}

@Schema({_id: false})
export class OrderPriceSchema {
  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.Number})
  serviceCommission: number;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.Number})
  storeProfit: number;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.Number})
  deliveryPrice: number;
}

@Schema({_id: false})
export class OrderProductsSchema {
  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.Number})
  amount: number;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.Number})
  serviceCommission: number;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.Number})
  storeProfit: number;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.Number})
  totalPrice: number;

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
  @Prop({type: mongoose.Schema.Types.Number})
  number: number;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
  user: User;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
  courier: User;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Store.name})
  store: Store;

  @ApiProperty({type: OrderProductsSchema, isArray: true})
  @Prop([{type: OrderProductsSchema}])
  products: OrderProductsSchema;

  @ApiProperty({type: OrderPriceSchema})
  @Prop({type: OrderPriceSchema})
  price: OrderPriceSchema;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.Number})
  totalPrice: number;

  @ApiProperty({enum: OrderStatuses})
  @Prop({type: mongoose.Schema.Types.String, enum: OrderStatuses})
  status: OrderStatuses;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  comment: string;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  rejectReason: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
