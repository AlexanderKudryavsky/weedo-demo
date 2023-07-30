import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { TokenResponse } from './types';
import { Model } from "mongoose";
// import { CreateUserDto } from '../users/dto/createa-user.dto';
import * as moment from 'moment';
import { User, UserDocument } from "src/users/entities/user.entity";
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) { }

  async findUser(authCredentials: AuthCredentialsDto): Promise<string | null> {
    const { email, password } = authCredentials;
    const user = await this.userModel.findOne<UserDocument>({ email });
    if (user && await user.validatePassword(password)) {
      return user._id;
    }
    return null;
  }

  async signIn(authCredentials: AuthCredentialsDto): Promise<TokenResponse> {
    const userId = await this.findUser(authCredentials);
    if (!userId) {
      throw new UnauthorizedException('Invalid email or password')
    }

    return this.generateTokens(userId);
  }

  async generateTokens(userId: string): Promise<TokenResponse> {
    const payload = { userId };
    const accessToken = await this.jwtService.signAsync(payload);
    const accessExp = moment(Date.now()).add(15, 'm').valueOf();
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '60d' });
    const refreshExp = moment(Date.now()).add(60, 'd').valueOf();

    await this.userModel.updateOne({_id: userId}, {refreshToken})
    return { accessToken, refreshToken, accessExp, refreshExp }
  }

  async signUp(userData: CreateUserDto): Promise<User> {
    try {
      const user = await new this.userModel(userData);
      return user.save();
    } catch (error) {
      console.log(888888, error)
      throw new BadRequestException(error.message);
    }
  }
}
