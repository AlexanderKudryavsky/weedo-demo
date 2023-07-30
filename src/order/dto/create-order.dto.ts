import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto {
  @ApiProperty()
  cartId: string;
}
