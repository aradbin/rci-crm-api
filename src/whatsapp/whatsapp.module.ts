import { Module } from '@nestjs/common';
import { WhatsappMessageService } from './whatsapp.message.service';
import { WhatsappBusinessNumberService, WhatsappConversationService, WhatsappUserService } from './whatsapp.service';
import { WhatsappMessageModel, WhatsappBusinessNumberModel, WhatsappUserModel, WhatsappConversationModel } from './whatsapp.models';
import { WhatsAppSettingController, WhatsappController, WhatsappConversationController, WhatsappUserController } from './whatsapp.controller';

@Module({
  controllers: [WhatsAppSettingController, WhatsappUserController, WhatsappController, WhatsappConversationController],
  providers: [
    WhatsappUserService,
    WhatsappMessageService,
    WhatsappConversationService,
    WhatsappBusinessNumberService,
    { provide: 'WhatsappUserModel', useValue: WhatsappUserModel },
    { provide: 'WhatsappMessageModel', useValue: WhatsappMessageModel },
    { provide: 'WhatsappConversationModel', useValue: WhatsappConversationModel },
    { provide: 'WhatsappBusinessNumberModel', useValue: WhatsappBusinessNumberModel },
  ],
})
export class WhatsappModule {}
