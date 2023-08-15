import { ApiProperty } from "@nestjs/swagger";

export class AssignCourierDto {
  @ApiProperty()
  courierId: string;
}
