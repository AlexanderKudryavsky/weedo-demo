import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import * as mongoose from 'mongoose';
import { Product } from "../../product/entities/product.entity";
import { SubCategory } from "../../sub-category/entities/sub-category.entity";
import { BotTypes } from "../dto/assign-bot.dto";
import { RolesEnum } from "../../helpers/constants";

@Schema({ _id: false })
class StoreAddressSchema {

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  country: string;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  city: string;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  street: string;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  house: string;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  apartment: string;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  postalCode: string;
}

@Schema({ _id: false })
class StoreLocationSchema {

  @ApiProperty({default: 'Point'})
  @Prop({type: mongoose.Schema.Types.String, default: 'Point'})
  type: 'Point';

  @ApiProperty({type: Number, isArray: true})
  @Prop({type: [{ type: mongoose.Schema.Types.Number }]})
  coordinates: Array<number>;
}

@Schema({ _id: false })
class StoreWorkingHoursSchema {
  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  sunday?: string;
  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  monday?: string;
  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  tuesday?: string;
  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  wednesday?: string;
  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  thursday?: string;
  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  friday?: string;
  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  saturday?: string;
}

@Schema({ timestamps: true})
export class Store {
  @ApiProperty()
  @Type(() => String)
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
  @Prop({type: StoreAddressSchema})
  address: StoreAddressSchema;

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
  @Prop({type: StoreWorkingHoursSchema})
  workingHours: StoreWorkingHoursSchema;

  @ApiProperty()
  @Prop({type: StoreLocationSchema})
  location: StoreLocationSchema;

  @ApiProperty({enum: BotTypes})
  @Prop({type: mongoose.Schema.Types.String, enum: RolesEnum})
  botType: BotTypes;

  @ApiProperty()
  @Prop({type: mongoose.Schema.Types.String})
  externalStoreId: string;

  @ApiProperty()
  @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: Product.name}]})
  products: Array<Product>;

  @ApiProperty()
  @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: SubCategory.name}]})
  subCategories: Array<Product>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const StoreSchema = SchemaFactory.createForClass(Store);

StoreSchema.index({
  name: "text",
  description: "text",
  phone: "text",
  website: "text",
})
StoreSchema.index({
  location: "2dsphere",
})