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

class UserLocation {

    @ApiProperty({default: 'Point'})
    type: 'Point';

    @ApiProperty({type: Number, isArray: true, description: '[longitude, latitude]'})
    coordinates: Array<number>;
}

class UserAddress {

    @ApiProperty()
    fullAddress: FullAddress;

    @ApiProperty()
    location: UserLocation;
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

    @ApiProperty({required: false})
    phone?: string;

    @ApiProperty({required: false})
    address?: UserAddress;

    @IsNotEmpty()
    @ApiProperty({
        enum: RolesEnum,
    })
    role: RolesEnum;
}
