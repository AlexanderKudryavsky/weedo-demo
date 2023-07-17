import { Injectable } from "@nestjs/common";
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category } from "./entities/category.entity";
import { PaginationResult } from "../helpers/types";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await new this.categoryModel(createCategoryDto);
    return category.save();
  }

  async findAll({limit, offset}): Promise<PaginationResult<Category>> {
    const totalCount = await this.categoryModel.count().exec();
    const results = await this.categoryModel.find({}, {},{limit, skip: offset}).exec();
    return {
      totalCount,
      results,
    };
  }

  async findOne(id: string) {
    return this.categoryModel.findById(id).exec();
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, {new: true}).exec();
  }

  async remove(id: string) {
    return this.categoryModel.deleteOne({_id: id}).exec();
  }
}
