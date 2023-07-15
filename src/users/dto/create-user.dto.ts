import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { RolesEnum } from "src/constants";

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
    location: string;

    @IsNotEmpty()
    @ApiProperty({
        enum: RolesEnum,
    })
    role: RolesEnum;
}
