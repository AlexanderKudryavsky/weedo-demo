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
  Res, Query
} from "@nestjs/common";
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Category } from "./entities/category.entity";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesEnum } from "../constants";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Store } from "../stores/entities/store.entity";
import { RemoveResult } from "../helpers/types";

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOkResponse({ type: Category })
  @ApiBearerAuth()
  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiOkResponse({ type: Category, isArray: true })
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
  findAll(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.categoryService.findAll({limit, offset});
  }

  @ApiOkResponse({ type: Category })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @ApiOkResponse({ type: Category })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @ApiOkResponse({ type: RemoveResult })
  @ApiBearerAuth()
  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response) {
    const result = await this.categoryService.remove(id);
    if (!result.acknowledged) {
      return response.status(400).send({success: false})
    }
    return response.status(200).send({success: true})
  }
}
