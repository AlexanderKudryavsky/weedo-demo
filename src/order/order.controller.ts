import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query
} from "@nestjs/common";
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Roles } from "../auth/decorators/roles.decorator";
import { RolesEnum } from "../helpers/constants";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Order, OrderStatuses } from "./entities/order.entity";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { ApiOkResponsePaginated } from "../helpers/apiOkResponsePaginated.decorator";
import { AssignCourierDto } from "./dto/assign-courier.dto";
import { StoreReport } from "../helpers/types";

@ApiTags('Orders')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOkResponse({ type: Order })
  @ApiBearerAuth()
  @Roles(RolesEnum.Admin, RolesEnum.Customer)
  @UseGuards(AuthGuard(), RolesGuard)
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
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
    name: "offset",
    type: String,
    required: false
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get()
  findAll(@Query('status') status?: OrderStatuses, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.orderService.findAll({status, limit, offset});
  }

  @ApiOkResponse({ type: Order })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
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
    name: "offset",
    type: String,
    required: false
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('/user/:id')
  findAllByUserId(@Param('id') id: string, @Query('status') status?: OrderStatuses, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.orderService.findAllByUserId({ id, status, limit, offset });
  }

  @ApiOkResponsePaginated(Order)
  @ApiQuery({
    name: "limit",
    type: String,
    required: false
  })
  @ApiQuery({
    name: "offset",
    type: String,
    required: false
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('/store/:id')
  findAllByStoreId(@Param('id') id: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.orderService.findAllByStoreId({ id, limit, offset });
  }

  @ApiBearerAuth()
  @Roles(RolesEnum.Courier, RolesEnum.Admin)
  @UseGuards(AuthGuard(), RolesGuard)
  @Patch(':id/assignCourier')
  assignCourier(@Param('id') id: string, @Body() assignCourierDto: AssignCourierDto) {
    return this.orderService.assignCourier(id, assignCourierDto)
  }

  @ApiOkResponse({type: Order})
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, updateOrderStatusDto)
  }

  @ApiOkResponse({type: StoreReport})
  @ApiQuery({
    name: "startDate",
    type: Date,
    required: false,
    example: '2023-09-03T22:00:00.447Z'
  })
  @ApiQuery({
    name: "endDate",
    type: Date,
    required: false,
    example: '2023-09-03T00:00:00.447Z'
  })
  @Get('store/:storeId/report')
  report(
    @Param('storeId') storeId: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.orderService.getReport(storeId, {startDate, endDate})
  }
}
