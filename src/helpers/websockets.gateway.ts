import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { OrderStatuses } from "../order/entities/order.entity";
import { User } from "../users/entities/user.entity";

type SendStatusData = {
  orderId: string;
  status: OrderStatuses;
  courier: User | null;
}

@WebSocketGateway({cors: true})
export class WebsocketsGateway {
  @WebSocketServer()
  server;


  sendStatus(data: SendStatusData) {
    this.server.emit(`orderStatusUpdated:${data.orderId}`, {orderId: data.orderId, status: data.status, courier: data.courier})
  }
}