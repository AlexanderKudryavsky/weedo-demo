import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { PaginationResult } from "../helpers/types";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ){}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll({limit, offset}): Promise<PaginationResult<User>> {
    const totalCount = await this.userModel.count().exec();
    const results = await this.userModel.find({}, {},{limit, skip: offset}).exec();
    return {
      totalCount,
      results,
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const res = await this.userModel.findOne({_id: id}).exec()
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
}
