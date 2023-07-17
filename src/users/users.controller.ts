import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  Query, Res
} from "@nestjs/common";
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiOkResponse } from "@nestjs/swagger";
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from 'src/helpers/constants';
import { User } from './entities/user.entity';
import { MongooseClassSerializerInterceptor } from 'src/helpers/mongooseClassSerializer.interceptor';
import { PaginationResult, RemoveResult } from "../helpers/types";
import { ApiOkResponsePaginated } from "../helpers/apiOkResponsePaginated.decorator";
import { Response } from "express";

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

  @ApiOkResponsePaginated(User)
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
  findAll(@Query('limit') limit?: string, @Query('offset') offset?: string): Promise<PaginationResult<User>> {
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

  @ApiOkResponse({ type: RemoveResult })
  @ApiBearerAuth()
  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: Response) {
    const result = await this.usersService.remove(id);
    if (!result.acknowledged) {
      return response.status(400).send({success: false})
    }
    return response.status(200).send({success: true})
  }
}
