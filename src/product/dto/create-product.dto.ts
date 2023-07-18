import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  subCategoryId: string

  @ApiProperty()
  price: number;

  @ApiProperty()
  effect: string;

  @ApiProperty()
  image: string;
}
