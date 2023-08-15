import { ApiProperty } from "@nestjs/swagger";
import { OrderStatuses } from "../order/entities/order.entity";

export class RemoveResult  {
  @ApiProperty()
  success: boolean
};

export class PaginationResult<Entity> {
  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  results: Array<Entity>;
}

export type OrdersFilter = {
  user?: string;
  status?: OrderStatuses;
}
