import { Module } from '@nestjs/common';
import { WhatsappMessageService } from './whatsapp.message.service';
import { WhatsappBusinessNumberService, WhatsappUserService } from './whatsapp.service';
import { WhatsAppSettingController, WhatsappController, WhatsappUserController } from './whatsapp.controller';

@Module({
  controllers: [WhatsAppSettingController, WhatsappUserController, WhatsappController],
  providers: [WhatsappUserService, WhatsappMessageService, WhatsappBusinessNumberService],
})
export class WhatsappModule { }
