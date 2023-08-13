import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Res, Query
} from "@nestjs/common";
import { Response } from 'express';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesEnum } from "../helpers/constants";
import { Store } from "./entities/store.entity";
import { PaginationResult, RemoveResult } from "../helpers/types";
import { ApiOkResponsePaginated } from "../helpers/apiOkResponsePaginated.decorator";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { User } from "../users/entities/user.entity";
import { AssignBotDto } from "./dto/assign-bot.dto";

@ApiTags('Stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @ApiOkResponse({ type: Store })
  @ApiBearerAuth()
  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @ApiOkResponsePaginated(Store)
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
  @ApiQuery({
    name: "search",
    type: String,
    required: false
  })
  @ApiBearerAuth()
  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  @Get()
  findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
  ): Promise<PaginationResult<Store>> {
    return this.storesService.findAll({limit, offset, search});
  }

  @ApiOkResponsePaginated(Store)
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
  @ApiQuery({
    name: "search",
    type: String,
    required: false
  })
  @ApiQuery({
    name: "categoryId",
    type: String,
    required: false
  })
  @ApiBearerAuth()
  @Roles(RolesEnum.Admin, RolesEnum.Customer)
  @UseGuards(AuthGuard())
  @Get('/available')
  findAllAvailable(
    @GetUser() user: User,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
  ): Promise<PaginationResult<Store>> {
    return this.storesService.findAllAvailable({limit, offset, search, user, categoryId});
  }

  @ApiOkResponse({ type: Store })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @ApiOkResponse({ type: Store })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(id, updateStoreDto);
  }

  @ApiOkResponse({ type: Store })
  @UsePipes(ValidationPipe)
  @Patch(':id/assignBot')
  assignBot(@Param('id') id: string, @Body() assignBotDto: AssignBotDto) {
    return this.storesService.assignBot(id, assignBotDto)
  }

  @ApiOkResponse({ type: RemoveResult })
  @ApiBearerAuth()
  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: Response) {
    const result = await this.storesService.remove(id);
    if (!result.acknowledged) {
      return response.status(400).send({success: false})
    }
    return response.status(200).send({success: true})
  }
}
