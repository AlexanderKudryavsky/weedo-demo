import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { CourierService } from './courier.service';
import { ApiOkResponsePaginated } from "../helpers/apiOkResponsePaginated.decorator";
import { Order, OrderStatuses } from "../order/entities/order.entity";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { User } from "../users/entities/user.entity";
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
}
