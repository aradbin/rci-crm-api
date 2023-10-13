import { Module } from '@nestjs/common';
import { WhatsappMessageService } from './whatsapp.message.service';
import { WhatsappBusinessNumberService, WhatsappUserService } from './whatsapp.service';
import { WhatsappMessageModel, WhatsappBusinessNumberModel, WhatsappUserModel } from './whatsapp.models';
import { WhatsAppSettingController, WhatsappController, WhatsappUserController } from './whatsapp.controller';

@Module({
  controllers: [WhatsAppSettingController, WhatsappUserController, WhatsappController],
  providers: [
    WhatsappUserService,
    WhatsappMessageService,
    WhatsappBusinessNumberService,
    { provide: 'WhatsappUserModel', useValue: WhatsappUserModel },
    { provide: 'WhatsappMessageModel', useValue: WhatsappMessageModel },
    { provide: 'WhatsappBusinessNumberModel', useValue: WhatsappBusinessNumberModel },
  ],
})
export class WhatsappModule {}
