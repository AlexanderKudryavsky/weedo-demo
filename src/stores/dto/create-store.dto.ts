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

  @ApiProperty({type: Number, isArray: true, description: '[longitude, latitude]'})
  coordinates: Array<number>;
}

class StoreWorkingHoursDto {
  @ApiProperty({required: false, example: '10:00 - 18:00', description: 'hh:mm - hh:mm or Closed'})
  sunday?: string;
  @ApiProperty({required: false, example: '10:00 - 18:00', description: 'hh:mm - hh:mm or Closed'})
  monday?: string;
  @ApiProperty({required: false, example: '10:00 - 18:00', description: 'hh:mm - hh:mm or Closed'})
  tuesday?: string;
  @ApiProperty({required: false, example: '10:00 - 18:00', description: 'hh:mm - hh:mm or Closed'})
  wednesday?: string;
  @ApiProperty({required: false, example: '10:00 - 18:00', description: 'hh:mm - hh:mm or Closed'})
  thursday?: string;
  @ApiProperty({required: false, example: '10:00 - 18:00', description: 'hh:mm - hh:mm or Closed'})
  friday?: string;
  @ApiProperty({required: false, example: '10:00 - 18:00', description: 'hh:mm - hh:mm or Closed'})
  saturday?: string;
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
  location: StoreLocationDto;
}
