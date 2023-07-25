import { ApiProperty } from "@nestjs/swagger";

class StoreAddressDto {

  @ApiProperty()
  country: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  street: string;

  @ApiProperty()
  house: string;

  @ApiProperty()
  apartment: string;

  @ApiProperty()
  postalCode: string;
}

class StoreLocationDto {

  @ApiProperty({default: 'Point'})
  type: 'Point';

  @ApiProperty({type: Number, isArray: true})
  coordinates: Array<number>;
}

class StoreWorkingHoursDto {
  @ApiProperty()
  monday?: string;
  @ApiProperty()
  tuesday?: string;
  @ApiProperty()
  wednesday?: string;
  @ApiProperty()
  thursday?: string;
  @ApiProperty()
  friday?: string;
  @ApiProperty()
  saturday?: string;
  @ApiProperty()
  sunday?: string;
}

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
  address: StoreAddressDto;

  @ApiProperty()
  image: string;

  @ApiProperty()
  deliveryTime: string;

  @ApiProperty()
  popularityCoefficient: number;

  @ApiProperty()
  workingHours: StoreWorkingHoursDto;

  @ApiProperty()
  products: Array<string>;

  @ApiProperty()
  subCategories: Array<string>;

  @ApiProperty()
  location: StoreLocationDto;
}
