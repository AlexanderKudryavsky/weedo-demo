import { ApiProperty } from "@nestjs/swagger";

class Address {

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

class Location {

  @ApiProperty()
  type: 'Point';

  @ApiProperty()
  coordinates: Array<number>;
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
  address: Address;

  @ApiProperty()
  image: string;

  @ApiProperty()
  deliveryTime: string;

  @ApiProperty()
  popularityCoefficient: number;

  @ApiProperty()
  workingHours: string;

  @ApiProperty()
  products: Array<string>;

  @ApiProperty()
  subCategories: Array<string>;

  @ApiProperty()
  location: Location;
}
