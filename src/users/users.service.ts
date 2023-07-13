import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
  ){}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return this.userModel.find();
  }

  async findOne(id: string): Promise<User> {
    try {
      const res = await this.userModel.findOne({_id: id});
      console.log(5555555, res._id);
      return res;
    } catch (error) {
      console.log(565656)
      throw new BadRequestException(error.message);
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne({_id: id}, updateUserDto);
  }

  remove(id: string) {
    return this.userModel.deleteOne({_id: id});
  }
}
