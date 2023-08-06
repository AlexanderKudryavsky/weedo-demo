import { Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage } from "mongoose";
import { Category } from "./entities/category.entity";
import { PaginationResult } from "../helpers/types";
import { Store } from "../stores/entities/store.entity";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Store.name) private storeModel: Model<Store>,
  ) {
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await new this.categoryModel(createCategoryDto);
    return category.save();
  }

  async findAll({ limit, offset }): Promise<PaginationResult<Category>> {
    const totalCount = await this.categoryModel.count().exec();
    const results = await this.categoryModel.find({}, {}, { limit, skip: offset }).exec();
    return {
      totalCount,
      results
    };
  }

  async findAllAvailable({ user }): Promise<Array<Category>> {
    const aggregation: Array<PipelineStage> = [
      {
        $match: {
          subCategories: {
            $exists: true,
            $not: {
              $size: 0
            }
          }
        }
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategories",
          foreignField: "_id",
          as: "subCategories"
        }
      },
      {
        $addFields:
          {
            subCategoriesProductsLength: {
              $map: {
                input: "$subCategories.products",
                as: "product",
                in: {
                  $size: "$$product",
                },
              },
            },
          },
      },
      {
        $addFields:
          {
            filteredSubCategoriesProductsLength: {
              $filter: {
                input: "$subCategoriesProductsLength",
                as: "item",
                cond: {
                  $gt: ["$$item", 0],
                },
              },
            },
          },
      },
      {
        $match: {
          filteredSubCategoriesProductsLength: {
            $exists: true,
            $not: {
              $size: 0,
            },
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "subCategories.category",
          foreignField: "_id",
          as: "subCategories.category"
        }
      },
      {
        $group: {
          _id: "$subCategories.category._id",
          doc: {
            $first: "$subCategories.category"
          }
        }
      },
      {
        $unwind: {
          path: "$doc",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $replaceRoot: {
          newRoot: "$doc"
        }
      },
    ];

    if (user.address?.location) {
      aggregation.unshift(
        {
          $match: {
            location: {
              $geoWithin: {
                $centerSphere: [
                  [
                    user.address.location.coordinates[0],
                    user.address.location.coordinates[1]
                  ], 5 / 6378.1
                ]
              }
            }
          }
        }
      )
    }

    return this.storeModel.aggregate(aggregation);
  }

  async findOne(id: string) {
    return this.categoryModel.findById(id).exec();
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.categoryModel.deleteOne({ _id: id }).exec();
  }
}
