import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost:27017', {dbName: 'weedo'}),
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
