import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Store } from "./entities/store.entity";

@Injectable()
export class StoresService {
  constructor(
    @InjectModel('Store') private storeModel: Model<Store>,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    const store = await new this.storeModel(createStoreDto);
    return store.save();
  }

  async findAll() {
    return this.storeModel.find().exec();
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
