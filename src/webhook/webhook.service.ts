import { Injectable } from '@nestjs/common';
import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class WebhookService {
  constructor(
    private socketGateway: SocketGateway
  ) {}
  
  async webhook(type: string, payload: any) {
    console.log('webhook.service',payload);
    await this.socketGateway.receive(type, payload);
    return true;
  }
}
