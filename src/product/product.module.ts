import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { jwtSecret } from "../helpers/constants";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "./entities/product.entity";
import { SubCategoryModule } from "../sub-category/sub-category.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: '15m'
      },
    }),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    SubCategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
})
export class ProductModule {}
