import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Store, StoreSchema } from "./entities/store.entity";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { jwtSecret } from "../helpers/constants";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: '15m'
      },
    }),
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }])
  ],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService]
})
export class StoresModule {}
