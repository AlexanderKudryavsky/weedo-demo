import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { jwtSecret } from "../helpers/constants";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./entities/order.entity";
import { UsersModule } from "../users/users.module";
import { WebsocketsGateway } from "../helpers/websockets.gateway";
import { ProductModule } from "../product/product.module";
import { HttpModule } from "@nestjs/axios";
import { StoresModule } from "../stores/stores.module";

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: '15m'
      },
    }),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    UsersModule,
    ProductModule,
    StoresModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, WebsocketsGateway]
})
export class OrderModule {}
