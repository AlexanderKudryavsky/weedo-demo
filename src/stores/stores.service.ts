import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
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

  async findAll({limit, offset}): Promise<PaginationResult<Store>> {
    const totalCount = await this.storeModel.count().exec();
    const results = await this.storeModel.find({}, {},{limit, skip: offset}).exec();
    return {
      results,
      totalCount,
    }
  }

  async findOne(id: string) {
    return this.storeModel.findById(id).exec();
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    return this.storeModel.findByIdAndUpdate(id, updateStoreDto, {new: true}).exec();
  }

  async remove(id: string) {
    return this.storeModel.deleteOne({_id: id}).exec();
  }
}
