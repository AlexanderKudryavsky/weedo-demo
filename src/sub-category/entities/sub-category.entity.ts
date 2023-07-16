import { ApiProperty } from "@nestjs/swagger";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import * as mongoose from 'mongoose';
import { Category } from "../../category/entities/category.entity";
import { Product } from "../../product/entities/product.entity";

@Schema({ timestamps: true})
export class SubCategory {
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  _id: string;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  name: string;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Category'})
  category: Category

  @ApiProperty()
  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]})
  products: Array<Product>

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);