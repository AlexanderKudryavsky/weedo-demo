import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtSecret } from "src/helpers/constants";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret
    });
  }

  async validate(payload: { userId: number }) {
    const { userId } = payload;

    const user = await this.userModel.findById(userId); 

    if(!user) {
      throw new UnauthorizedException()
    }

    return user;
  }
}
