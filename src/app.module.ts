import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot('mongodb://mongo:BOOx14SDyF36j85ffnOl@containers-us-west-6.railway.app:6949', {dbName: 'weedo'}),
    UsersModule,
    StoresModule,
    CategoryModule,
    SubCategoryModule,
    ProductModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
