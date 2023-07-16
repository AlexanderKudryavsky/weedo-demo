import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  Query
} from "@nestjs/common";
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags, ApiOkResponse, ApiQuery } from "@nestjs/swagger";
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from 'src/constants';
import { User } from './entities/user.entity';
import { MongooseClassSerializerInterceptor } from 'src/mongooseClassSerializer.interceptor';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @ApiBearerAuth()
  // @Roles(RolesEnum.Admin)
  // @UseGuards(AuthGuard(), RolesGuard)
  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @ApiOkResponse({ type: User, isArray: true })
  @ApiQuery({
    name: "limit",
    type: String,
    required: false
  })
  @ApiQuery({
    name: "offset",
    type: String,
    required: false
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @Get()
  findAll(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.usersService.findAll({limit, offset});
  }

  @ApiOkResponse({ type: User })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @Get(':id')
  findOne(@Param('id') id: string) {
      return this.usersService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
