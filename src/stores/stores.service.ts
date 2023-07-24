import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { Store } from "./entities/store.entity";
import { PaginationResult } from "../helpers/types";

@Injectable()
export class StoresService {
  constructor(
    @InjectModel('Store') private storeModel: Model<Store>,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    const store = await new this.storeModel(createStoreDto);
    return store.save();
  }

  async findAll({limit, offset, search}): Promise<PaginationResult<Store>> {
    const filter: FilterQuery<Store> = {};
    if (search) {
      filter.$text = {$search: search}
    }
    const totalCount = await this.storeModel.count(filter).exec();
    const results = await this.storeModel.find(filter, {},{limit, skip: offset}).populate({
      path: 'subCategories',
      populate: {
        path: 'products'
      }
    }).exec();
    return {
      results,
      totalCount,
    }
  }

  async findOne(id: string) {
    return this.storeModel.findById(id).populate({
      path: 'subCategories',
      populate: {
        path: 'products'
      }
    }).exec();
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    const {subCategories, ...updateStorePayload} = updateStoreDto;
    return this.storeModel.findByIdAndUpdate(id, {
      $set: {
        ...updateStorePayload
      },
      $addToSet: { subCategories: { $each: subCategories } },
    }, {new: true}).exec();
  }

  async remove(id: string) {
    return this.storeModel.deleteOne({_id: id}).exec();
  }
}
