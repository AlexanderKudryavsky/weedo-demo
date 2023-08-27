import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { CourierModule } from './courier/courier.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot('mongodb://mongo:eD4Z25FUCLUlB3XJYJCd@containers-us-west-184.railway.app:7397', {dbName: 'weedo'}),
    UsersModule,
    StoresModule,
    CategoryModule,
    SubCategoryModule,
    ProductModule,
    OrderModule,
    CourierModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
