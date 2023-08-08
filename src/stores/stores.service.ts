import { Injectable } from "@nestjs/common";
import { CreateStoreDto } from "./dto/create-store.dto";
import { UpdateStoreDto } from "./dto/update-store.dto";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, PipelineStage, Types } from "mongoose";
import { Store } from "./entities/store.entity";
import { PaginationResult } from "../helpers/types";
import { AssignBotDto } from "./dto/assign-bot.dto";

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<Store>
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    const store = await new this.storeModel(createStoreDto);
    return store.save();
  }

  async findAll({ limit, offset, search, user, categoryId }): Promise<PaginationResult<Store>> {
    if (categoryId) {
      return this.findAllByCategoryId({ limit, offset, search, user, categoryId });
    }
    return this.findAllWithoutCategory({ limit, offset, search, user });
  }

  async findAllWithoutCategory({ limit, offset, search, user }): Promise<PaginationResult<Store>> {
    const filter: FilterQuery<Store> = {};
    if (search) {
      filter.$text = { $search: search };
    }
    if (user.address?.location) {
      filter.location = {
        $geoWithin: {
          $centerSphere: [[
            user.address.location.coordinates[0],
            user.address.location.coordinates[1]
          ], 5 / 6378.1]
        }
      };
    }

    const totalCount = await this.storeModel.count(filter).exec();
    const results = await this.storeModel.find(filter, {}, { limit, skip: offset }).populate({
      path: "subCategories",
      populate: {
        path: "products"
      }
    }).exec();
    return {
      totalCount,
      results
    };
  }

  async findAllByCategoryId({ limit, offset, search, user, categoryId }): Promise<PaginationResult<Store>> {
    const aggregation: Array<PipelineStage> = [
      {
        $lookup: {
          from: "subcategories",
          let: {
            subCategories: "$subCategories"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    "$_id", "$$subCategories"
                  ]
                }
              }
            },
            {
              $lookup: {
                from: "products",
                let: { products: "$products" },
                pipeline: [
                  {
                    $match:
                      {
                        $expr: {
                          $in: [
                            "$_id", "$$products"
                          ]
                        }
                      }
                  }
                ],
                as: "products"
              }
            }
          ],
          as: "subCategories"
        }
      }
    ];

    if (user.address?.location) {
      aggregation.unshift({
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
      });
    }

    if (search) {
      aggregation.unshift({
        $match: {
          $text: {
            $search: search
          }
        }
      });
    }

    if (categoryId) {
      aggregation.push({
        $match: {
          "subCategories.category": new Types.ObjectId(categoryId)
        }
      });
    }

    aggregation.push(
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          results: { $push: "$$ROOT" }
        }
      }
    );

    if ((offset && !isNaN(+offset)) && (limit && !isNaN(+limit))) {
      aggregation.push({
        $project: {
          totalCount: "$totalCount",
          results: {
            $slice: ["$results", +offset, +limit]
          }
        }
      });
    }

    aggregation.push(
      {
        $project: {
          _id: 0,
        }
      }
    )

    const result = await this.storeModel.aggregate(aggregation) as Array<PaginationResult<Store>>

    return result[0];
  }

  async findOne(id: string) {
    return this.storeModel.findById(id).populate({
      path: "subCategories",
      populate: {
        path: "products"
      }
    }).exec();
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    return this.storeModel.findByIdAndUpdate(id, {
      $set: {
        ...updateStoreDto
      }
    }, { new: true }).exec();
  }

  async assignBot(id: string, assignBotDto: AssignBotDto) {
    return this.storeModel.findByIdAndUpdate(id, {
      ...assignBotDto
    }, { new: true }).exec()
  }

  async remove(id: string) {
    return this.storeModel.deleteOne({ _id: id }).exec();
  }
}
