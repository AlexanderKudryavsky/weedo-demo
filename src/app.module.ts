import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot('mongodb://mongo:BOOx14SDyF36j85ffnOl@containers-us-west-6.railway.app:6949', {dbName: 'weedo'}),
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
