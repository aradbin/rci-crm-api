import { Module } from '@nestjs/common';
import { WhatsappMessageService } from './whatsapp.message.service';
import { WhatsappSettingService, WhatsappUserService } from './whatsapp.service';
import { WhatsappMessageModel, WhatsappSettingModel, WhatsappUserModel } from './whatsapp.models';
import { WhatsAppSettingController, WhatsappController, WhatsappUserController } from './whatsapp.controller';

@Module({
  controllers: [WhatsAppSettingController, WhatsappUserController, WhatsappController],
  providers: [
    WhatsappMessageService,
    WhatsappUserService,
    WhatsappSettingService,
    { provide: 'WhatsappUserModel', useValue: WhatsappUserModel },
    { provide: 'WhatsappMessageModel', useValue: WhatsappMessageModel },
    { provide: 'WhatsappSettingModel', useValue: WhatsappSettingModel },
  ],
})
export class WhatsappModule {}
