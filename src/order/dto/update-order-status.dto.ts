import { ApiProperty } from "@nestjs/swagger";
import { OrderStatuses } from "../entities/order.entity";

export class UpdateOrderStatusDto {
  @ApiProperty()
  status: OrderStatuses;
}
