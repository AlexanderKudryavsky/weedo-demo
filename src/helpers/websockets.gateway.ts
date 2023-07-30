import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { OrderStatuses } from "../order/entities/order.entity";

type SendStatusData = {
  orderId: string;
  status: OrderStatuses;
}

@WebSocketGateway({cors: true})
export class WebsocketsGateway {
  @WebSocketServer()
  server;


  sendStatus(data: SendStatusData) {
    this.server.emit('orderStatusUpdated', {orderId: data.orderId, status: data.status})
  }
}