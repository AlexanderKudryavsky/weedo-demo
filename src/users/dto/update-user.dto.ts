import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { OmitType } from "@nestjs/swagger/dist/type-helpers/omit-type.helper";

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'] as const)) {}
