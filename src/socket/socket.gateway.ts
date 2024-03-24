import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { MessageService } from 'src/message/message.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private messageService: MessageService) { }

  @WebSocketServer() server: Server;
  private connectedUsers: { [userId: number]: Socket } = {};

  handleConnection(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    this.connectedUsers[userId] = client;
  }

  handleDisconnect(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    delete this.connectedUsers[userId];
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: { conversation_id: number, sender: number, receiver: number, message: string }) {
    const createMessageDto: CreateMessageDto = { conversation_id: data?.conversation_id, user_id: data?.receiver, message: data?.message, status: "", created_at: "", created_by: data?.sender };
    const response = await this.messageService.create(data?.sender, createMessageDto);

    const recipientSocket = this.connectedUsers[data.receiver];
    if (recipientSocket) {
      recipientSocket.emit('message', response);
    }

    return response;
  }

  async handleVoIP(log: any) {
    this.server.emit('voip', log);
  }
}
