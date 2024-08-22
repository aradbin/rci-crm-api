import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [SocketModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
