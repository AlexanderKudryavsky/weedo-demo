import { ApiProperty } from "@nestjs/swagger";

export class CreateStoreDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  website: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  deliveryTime: string;

  @ApiProperty()
  popularityCoefficient: number;

  @ApiProperty()
  workingHours: string;

  @ApiProperty()
  products: Array<string>
}
