import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import * as mongoose from 'mongoose';
import { Product } from "../../product/entities/product.entity";

@Schema({ timestamps: true})
export class Store {
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  _id: string;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  name: string;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  description: string;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  phone: string;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  website: string;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  address: string;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  image: string;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  deliveryTime: string;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.Number, default: 0})
  popularityCoefficient: number;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  workingHours: string;

  @ApiProperty()
  @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]})
  products: Array<Product>

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const StoreSchema = SchemaFactory.createForClass(Store);