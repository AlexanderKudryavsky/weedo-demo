import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { jwtSecret } from "../helpers/constants";
import { MongooseModule } from "@nestjs/mongoose";
import { Cart, CartSchema } from "./entities/cart.entity";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: '15m'
      },
    }),
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    UsersModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
  ]
})
export class CartModule {}
