import { Injectable } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { InjectModel } from "@nestjs/mongoose";
import { SubCategory } from "./entities/sub-category.entity";
import { Model } from "mongoose";
import { PaginationResult } from "../helpers/types";

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>
  ) {}
  async create(createSubCategoryDto: CreateSubCategoryDto) {
    return this.subCategoryModel.create({
      ...createSubCategoryDto,
      category: createSubCategoryDto.categoryId,
    })
  }

  async findAll({limit, offset}): Promise<PaginationResult<SubCategory>> {
    const totalCount = await this.subCategoryModel.count().exec();
    const results = await this.subCategoryModel.find({}, {},{limit, skip: offset}).populate(['category']).exec();
    return {
      totalCount,
      results,
    };
  }

  findOne(id: string) {
    return this.subCategoryModel.findById(id).populate(['category']).exec();
  }

  update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    return this.subCategoryModel.findByIdAndUpdate(id, {
      ...updateSubCategoryDto,
      category: updateSubCategoryDto.categoryId,
    }, {new: true}).populate('category').exec();
  }

  remove(id: string) {
    return this.subCategoryModel.deleteOne({_id: id}).exec();
  }
}
