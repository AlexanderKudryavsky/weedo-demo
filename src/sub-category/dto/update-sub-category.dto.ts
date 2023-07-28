import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateSubCategoryDto } from './create-sub-category.dto';
import { Optional } from "@nestjs/common";

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {
  @Optional()
  @ApiProperty()
  products: Array<string>;
}
