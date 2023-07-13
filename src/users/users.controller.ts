import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags, ApiOkResponse } from '@nestjs/swagger';
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @Get()
  findAll() {
    return this.usersService.findAll();
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
