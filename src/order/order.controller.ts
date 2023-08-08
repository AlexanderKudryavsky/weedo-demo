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
import { Order } from "./entities/order.entity";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { ApiOkResponsePaginated } from "../helpers/apiOkResponsePaginated.decorator";

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
  findAll(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.orderService.findAll({limit, offset});
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
  findAllByUserId(@Param('id') id: string, @Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.orderService.findAllByUserId({ id, limit, offset });
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

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, updateOrderStatusDto)
  }
}
