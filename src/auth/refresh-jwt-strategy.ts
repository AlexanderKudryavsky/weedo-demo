import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtSecret } from "src/helpers/constants";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy,'jwt-refresh') {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      passReqToCallback: true
    });
  }

  async validate(req, payload: { userId: number }) {
    const { userId } = payload;

    const user = await this.userModel.findById(userId).select(['_id', 'refreshToken']);

    if(!user.refreshToken){
      throw new UnauthorizedException();
    }
    if(req.body.refreshToken !== user.refreshToken){
      throw new UnauthorizedException();
    }
    return user;
  }
}
