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

class StoreReportOrders {
  @ApiProperty()
  number: number;
  @ApiProperty()
  storeProfit: number;
}

export class StoreReport {
  @ApiProperty()
  totalStoreProfit: number;
  @ApiProperty({isArray: true, type: StoreReportOrders})
  orders: Array<StoreReportOrders>
}
