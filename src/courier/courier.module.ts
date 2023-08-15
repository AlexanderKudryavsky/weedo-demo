import { Module } from '@nestjs/common';
import { CourierService } from './courier.service';
import { CourierController } from './courier.controller';
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { jwtSecret } from "../helpers/constants";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "../order/entities/order.entity";
import { OrderModule } from "../order/order.module";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: '15m'
      },
    }),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    OrderModule,
  ],
  controllers: [CourierController],
  providers: [CourierService],
})
export class CourierModule {}
