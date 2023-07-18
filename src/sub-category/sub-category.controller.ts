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
  Query, Res
} from "@nestjs/common";
import { SubCategoryService } from './sub-category.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesEnum } from "../helpers/constants";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/guards/roles.guard";
import { SubCategory } from "./entities/sub-category.entity";
import { ApiOkResponsePaginated } from "../helpers/apiOkResponsePaginated.decorator";
import { PaginationResult, RemoveResult } from "../helpers/types";
import { Response } from "express";

@ApiTags('Sub categories')
@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @ApiOkResponse({ type: SubCategory })
  @ApiBearerAuth()
  @Roles(RolesEnum.Admin, RolesEnum.Store)
  @UseGuards(AuthGuard(), RolesGuard)
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.subCategoryService.create(createSubCategoryDto);
  }

  @ApiOkResponsePaginated(SubCategory)
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
  findAll(@Query('limit') limit?: string, @Query('offset') offset?: string): Promise<PaginationResult<SubCategory>> {
    return this.subCategoryService.findAll({limit, offset});
  }

  @ApiOkResponse({ type: SubCategory })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subCategoryService.findOne(id);
  }

  @ApiOkResponse({ type: SubCategory })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubCategoryDto: UpdateSubCategoryDto) {
    return this.subCategoryService.update(id, updateSubCategoryDto);
  }

  @ApiOkResponse({ type: RemoveResult })
  @ApiBearerAuth()
  @Roles(RolesEnum.Admin, RolesEnum.Store)
  @UseGuards(AuthGuard(), SubCategory)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: Response) {
    const result = await this.subCategoryService.remove(id);
    if (!result.acknowledged) {
      return response.status(400).send({success: false})
    }
    return response.status(200).send({success: true})
  }
}
