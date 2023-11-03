import { Module } from '@nestjs/common';
import { WhatsappMessageService } from './whatsapp.message.service';
import { WhatsappController } from './whatsapp.controller';
import { UserSettingsModule } from 'src/user-settings/user-settings.module';

@Module({
  imports: [UserSettingsModule],
  controllers: [WhatsappController],
  providers: [WhatsappMessageService],
})
export class WhatsappModule { }
