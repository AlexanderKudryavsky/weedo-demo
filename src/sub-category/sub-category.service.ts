import { Inject, Injectable } from "@nestjs/common";
import { CreateSubCategoryDto } from "./dto/create-sub-category.dto";
import { UpdateSubCategoryDto } from "./dto/update-sub-category.dto";
import { InjectModel } from "@nestjs/mongoose";
import { SubCategory } from "./entities/sub-category.entity";
import { Model } from "mongoose";
import { PaginationResult } from "../helpers/types";
import { StoresService } from "../stores/stores.service";
import { UpdateStoreDto } from "../stores/dto/update-store.dto";

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
    @Inject(StoresService) private readonly storeService: StoresService,
  ) {}

  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const subCategory = await this.subCategoryModel.create({
      ...createSubCategoryDto,
      category: createSubCategoryDto.categoryId,
      store: createSubCategoryDto.storeId
    });

    await this.storeService.update(createSubCategoryDto.storeId, {
      subCategories: [subCategory._id]
    } as UpdateStoreDto);

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
    return this.subCategoryModel.findByIdAndUpdate(id, {
      $set: {
        name: updateSubCategoryDto.name,
        store: updateSubCategoryDto.storeId,
        category: updateSubCategoryDto.categoryId,
      },
      $addToSet: { products: { $each: updateSubCategoryDto.products } }
    }, { new: true }).populate("category").exec();
  }

  remove(id: string) {
    return this.subCategoryModel.deleteOne({ _id: id }).exec();
  }
}
