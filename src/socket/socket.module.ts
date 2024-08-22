import { Global, Module } from '@nestjs/common';
import { MessageModule } from 'src/message/message.module';
import { WhatsappModule } from 'src/whatsapp/whatsapp.module';
import { SocketGateway } from './socket.gateway';

@Global()
@Module({
    imports: [MessageModule, WhatsappModule],
    providers: [SocketGateway],
    exports: [SocketGateway]
})
export class SocketModule { }
