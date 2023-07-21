import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtSecret } from 'src/helpers/constants';
import { StoresModule } from "../stores/stores.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: '15m'
      },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    StoresModule,
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule { }
