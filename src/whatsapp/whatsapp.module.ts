import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { AccountModule } from 'src/account/account.module';
import { RequestModule } from 'src/request/request.module';

@Module({
  imports: [RequestModule, AccountModule],
  controllers: [WhatsappController],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
