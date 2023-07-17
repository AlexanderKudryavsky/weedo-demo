import { Controller, Post, Get, UsePipes, UseGuards, ValidationPipe, Body, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";
import { GetUser } from "./decorators/get-user.decorator";
import { TokenResponse } from "./types";
import { MongooseClassSerializerInterceptor } from "src/helpers/mongooseClassSerializer.interceptor";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ type: TokenResponse })
  @Post('signin')
  @UsePipes(ValidationPipe)
  signIn(@Body() authCredentials: AuthCredentialsDto) {
    return this.authService.signIn(authCredentials);
  }

  @ApiCreatedResponse({ type: User, description: 'User created successfully' })
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @Post('signup')
  @UsePipes(ValidationPipe)
  signUp(@Body() user: CreateUserDto) {
    return this.authService.signUp(user);
  }

  @ApiOkResponse({ type: User })
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @ApiBearerAuth()
  @Get('getme')
  @UseGuards(AuthGuard())
  getMe(@GetUser() user: User) {
    return user;
  }

  @ApiOkResponse({ type: TokenResponse })
  @Post('refresh')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('jwt-refresh'))
  refresh(@Body() refreshData: RefreshDto, @GetUser() user) {
    return this.authService.generateTokens(user._id)
  }
}
