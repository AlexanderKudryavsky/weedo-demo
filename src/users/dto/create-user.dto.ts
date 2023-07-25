import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { RolesEnum } from "src/helpers/constants";

class FullAddress {

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

class Address {

    @ApiProperty()
    fullAddress: FullAddress;

    @ApiProperty()
    location: Location;
}

export class CreateUserDto {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @ApiProperty()
    password: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    address: Address;

    @IsNotEmpty()
    @ApiProperty({
        enum: RolesEnum,
    })
    role: RolesEnum;
}
