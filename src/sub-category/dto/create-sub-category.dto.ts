import { ApiProperty } from "@nestjs/swagger";
import { Optional } from "@nestjs/common";

export class CreateSubCategoryDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  categoryId: string;

  @Optional()
  @ApiProperty()
  products: Array<string>;
}
