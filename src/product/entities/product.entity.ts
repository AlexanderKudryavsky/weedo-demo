import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import * as mongoose from 'mongoose';
import { Category } from "../../category/entities/category.entity";
import { SubCategory } from "../../sub-category/entities/sub-category.entity";

@Schema({ timestamps: true})
export class Product {
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
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Category.name})
  category: Category

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: SubCategory.name})
  subCategory: SubCategory

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.Number})
  price: number;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  effect: string;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  image: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
