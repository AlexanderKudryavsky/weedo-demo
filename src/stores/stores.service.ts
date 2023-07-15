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

  findAll() {
    return `This action returns all stores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} store`;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }
}
