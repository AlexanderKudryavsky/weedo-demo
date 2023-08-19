import { Inject, Injectable } from "@nestjs/common";
import { CreateSubCategoryDto } from "./dto/create-sub-category.dto";
import { UpdateSubCategoryDto } from "./dto/update-sub-category.dto";
import { InjectModel } from "@nestjs/mongoose";
import { SubCategory } from "./entities/sub-category.entity";
import { Model, UpdateQuery } from "mongoose";
import { PaginationResult } from "../helpers/types";
import { Store } from "../stores/entities/store.entity";

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
    @InjectModel(Store.name) private storeModel: Model<Store>,
  ) {}

  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const subCategory = await this.subCategoryModel.create({
      ...createSubCategoryDto,
      category: createSubCategoryDto.categoryId,
      store: createSubCategoryDto.storeId
    });

    await this.storeModel.updateOne({_id: createSubCategoryDto.storeId }, {
      $addToSet: { subCategories: subCategory._id }
    })

    return subCategory
  }

  async findAll({ limit, offset }): Promise<PaginationResult<SubCategory>> {
    const totalCount = await this.subCategoryModel.count().exec();
    const results = await this.subCategoryModel.find({}, {}, {
      limit,
      skip: offset
    }).populate(["category", "products", "store"]).exec();
    return {
      totalCount,
      results
    };
  }

  findOne(id: string) {
    return this.subCategoryModel.findById(id).populate(["category", "products", "store"]).exec();
  }

  update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    const updateData: UpdateQuery<SubCategory> = {
      $set: {},
    }

    if (updateSubCategoryDto.name) {
      updateData.$set.name = updateSubCategoryDto.name;
    }

    if (updateSubCategoryDto.storeId) {
      updateData.$set.store = updateSubCategoryDto.storeId;
    }

    if (updateSubCategoryDto.categoryId) {
      updateData.$set.category = updateSubCategoryDto.categoryId;
    }

    if (updateSubCategoryDto.products && updateSubCategoryDto.products.length) {
      updateData.$addToSet = { products: { $each: updateSubCategoryDto.products } };
    }

    return this.subCategoryModel.findByIdAndUpdate(id, updateData, { new: true }).populate("category").exec();
  }

  remove(id: string) {
    return this.subCategoryModel.deleteOne({ _id: id }).exec();
  }
}
