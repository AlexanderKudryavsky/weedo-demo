import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { PaginationResult } from "../helpers/types";
import { StoresService } from "../stores/stores.service";
import { Store } from "../stores/entities/store.entity";
import { AssignBotDto } from "./dto/assign-bot.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Store.name) private storeModel: Model<Store>,
    @Inject(StoresService) private readonly storesService: StoresService,
  ){}

  async findAll({limit, offset}): Promise<PaginationResult<User>> {
    const totalCount = await this.userModel.count().exec();
    const results = await this.userModel.find({}, {},{limit, skip: offset}).populate({path: 'favoritesStores', select: '-subCategories -products'}).exec();
    return {
      totalCount,
      results,
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const res = await this.userModel.findOne({_id: id}).populate({path: 'favoritesStores', select: '-subCategories -products'}).exec()
      return res;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne({_id: id}, updateUserDto).exec();
  }

  remove(id: string) {
    return this.userModel.deleteOne({_id: id}).exec();
  }

  async getUserFavoritesStores(userId: string) {
    const user = await this.userModel.findById(userId).exec();

    return this.storeModel.find({
      _id: {
        $in: user.favoritesStores,
      }
    }).populate({
      path: "subCategories",
      populate: {
        path: "products"
      }
    }).exec();
  }

  async updateFavoritesStores(userId: string, storeId: string) {
    const store = await this.storesService.findOne(storeId)
    if (!store) {
      throw new BadRequestException('Store not found')
    }
    return this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { favoritesStores: storeId },
    }, { new: true });
  };

  async assignBot(userId: string, assignBotDto: AssignBotDto) {
    return this.userModel.findByIdAndUpdate(userId, {
      ...assignBotDto
    }, { new: true }).exec()
  }

  async removeFavoritesStores(userId: string, storeId: string) {
    return this.userModel.findByIdAndUpdate(userId, {
      $pull: { favoritesStores: storeId },
    }, { new: true })
  }
}
