import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import mongoose from "mongoose";
import { User } from "../../users/entities/user.entity";
import { Product } from "../../product/entities/product.entity";

export enum CartStatuses {
  Active = 'Active',
  Ordered = 'Ordered',
}

@Schema({_id: false})
export class CartProductsSchema {
  @ApiProperty()
  @Prop()
  amount: number;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Product.name})
  product: Product;
}

@Schema({ timestamps: true})
export class Cart {
  @ApiProperty()
  @Type(() => String)
  @Transform(({ value }) => value.toString())
  _id: string;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
  userId: string;

  @ApiProperty({type: CartProductsSchema, isArray: true})
  @Prop([{ type: CartProductsSchema}])
  products: Array<CartProductsSchema>;

  @ApiProperty({enum: CartStatuses})
  @Prop({type: mongoose.Schema.Types.String, enum: CartStatuses, default: CartStatuses.Active})
  status: CartStatuses;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
