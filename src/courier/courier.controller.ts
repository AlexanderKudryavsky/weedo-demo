import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { CourierService } from './courier.service';
import { ApiOkResponsePaginated } from "../helpers/apiOkResponsePaginated.decorator";
import { Order, OrderStatuses } from "../order/entities/order.entity";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesEnum } from "../helpers/constants";

@ApiTags('Courier')
@Controller('courier')
export class CourierController {
  constructor(private readonly courierService: CourierService) {}

  @ApiOkResponsePaginated(Order)
  @ApiBearerAuth()
  @Roles(RolesEnum.Admin, RolesEnum.Courier)
  @UseGuards(AuthGuard(), RolesGuard)
  @Get('orders/available')
  findAllAvailable() {
    return this.courierService.findAllAvailable();
  }

  @ApiOkResponsePaginated(Order)
  @ApiQuery({
    name: "status",
    type: String,
    enum: OrderStatuses,
    required: false
  })
  @ApiQuery({
    name: "limit",
    type: String,
    required: false
  })
  @ApiQuery({
    name: "startDate",
    type: Date,
    required: false,
    example: '2023-09-03T01:38:32.447Z'
  })
  @ApiQuery({
    name: "endDate",
    type: Date,
    required: false,
    example: '2023-09-03T01:38:32.447Z'
  })
  @ApiQuery({
    name: "offset",
    type: String,
    required: false
  })
  @ApiBearerAuth()
  @Roles(RolesEnum.Admin, RolesEnum.Courier)
  @UseGuards(AuthGuard(), RolesGuard)
  @Get(':id/orders')
  findAll(
    @Param('id') id: string,
    @Query('status') status?: OrderStatuses,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.courierService.findAll({courierId: id, status, limit, offset, startDate, endDate});
  }
}
