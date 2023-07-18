import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateSubCategoryDto } from './create-sub-category.dto';

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {
  @ApiProperty()
  name: string;

  @ApiProperty()
  categoryId: string;
}
