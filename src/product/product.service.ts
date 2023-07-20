import { Inject, Injectable } from "@nestjs/common";
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Product } from "./entities/product.entity";
import { Model } from "mongoose";
import { PaginationResult } from "../helpers/types";
import { SubCategoryService } from "../sub-category/sub-category.service";
import { UpdateSubCategoryDto } from "../sub-category/dto/update-sub-category.dto";

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @Inject(SubCategoryService) private readonly subCategoryService: SubCategoryService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const subCategory = await this.subCategoryService.findOne(createProductDto.subCategoryId);
    const product = await this.productModel.create({
      ...createProductDto,
      category: subCategory.category._id,
      subCategory: createProductDto.subCategoryId,
      store: subCategory.store._id,
    })
    await this.subCategoryService.update(createProductDto.subCategoryId, {
      products: [product._id]
    } as UpdateSubCategoryDto);
    return product;
  }

  async findAll({limit, offset}): Promise<PaginationResult<Product>> {
    const totalCount = await this.productModel.count().exec();
    const results = await this.productModel.find({}, {},{limit, skip: offset}).populate(['category', 'subCategory', 'store']).exec();
    return {
      totalCount,
      results,
    };
  }

  findOne(id: string) {
    return this.productModel.findById(id).populate(['category', 'subCategory', 'store']).exec();
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productModel.findByIdAndUpdate(id, updateProductDto, {new: true}).exec();
  }

  remove(id: string) {
    return this.productModel.deleteOne({_id: id}).exec();
  }
}
