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
import { PaginationResult, RemoveResult } from "../helpers/types";
import { ApiOkResponsePaginated } from "../helpers/apiOkResponsePaginated.decorator";
import { Response } from "express";
import { Store } from "../stores/entities/store.entity";

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponsePaginated(User)
  @ApiQuery({
    name: "role",
    type: String,
    required: false,
    enum: RolesEnum,
  })
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
  @Get()
  findAll(@Query('role') role?: RolesEnum, @Query('limit') limit?: string, @Query('offset') offset?: string): Promise<PaginationResult<User>> {
    return this.usersService.findAll({limit, offset, role});
  }

  @ApiOkResponse({ type: User })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get(':id')
  findOne(@Param('id') id: string) {
      return this.usersService.findOne(id);
  }

  @ApiOkResponse({ type: User })
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

  @ApiOkResponse({ type: Store, isArray: true })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get(':id/favoritesStores')
  async getUserFavoritesStores(@Param('id') id: string) {
    return this.usersService.getUserFavoritesStores(id);
  }

  @ApiOkResponse({ type: User })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @Patch(':id/favoriteStore/:storeId')
  addFavoriteStore(@Param('id') id: string, @Param('storeId') storeId: string) {
    return this.usersService.updateFavoritesStores(id, storeId);
  }

  @ApiOkResponse({ type: User })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @Delete(':id/favoriteStore/:storeId')
  removeFavoriteStore(@Param('id') id: string, @Param('storeId') storeId: string) {
    return this.usersService.removeFavoritesStores(id, storeId);
  }
}
