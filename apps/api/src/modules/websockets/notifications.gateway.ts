import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  },
  namespace: 'notifications',
  pingTimeout: 60000,
  pingInterval: 25000,
  maxHttpBufferSize: 1e6,
  transports: ['websocket', 'polling'],
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private connectedClients = new Map<string, Socket>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;

    if (this.connectedClients.size >= 1000) {
      this.logger.warn('Max connections reached, rejecting client');
      client.disconnect();
      return;
    }

    if (userId) {
      void client.join(`user_${userId}`);
      this.connectedClients.set(client.id, client);
      this.logger.log(`Client connected: ${client.id}, User: ${userId}`);
    } else {
      this.logger.log(`Client connected: ${client.id} (anonymous)`);
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe_to_order')
  handleOrderSubscription(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: string },
  ) {
    void client.join(`order_${data.orderId}`);
    return { status: 'joined', room: `order_${data.orderId}` };
  }

  sendToUser(userId: string, event: string, payload: any) {
    this.server.to(`user_${userId}`).emit(event, payload);
  }

  sendToOrder(orderId: string, event: string, payload: any) {
    this.server.to(`order_${orderId}`).emit(event, payload);
  }

  broadcast(event: string, payload: any) {
    this.server.emit(event, payload);
  }
}
