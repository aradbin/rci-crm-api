import { Global, Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { MessageModule } from 'src/message/message.module';

@Global()
@Module({
    imports: [MessageModule],
    providers: [SocketGateway],
    exports: [SocketGateway]
})
export class SocketModule { }
