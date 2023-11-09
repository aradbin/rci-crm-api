import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller';
import { UserSettingsModule } from 'src/user-settings/user-settings.module';
import { WhatsappService } from './whatsapp.service';

@Module({
  imports: [UserSettingsModule],
  controllers: [WhatsappController],
  providers: [WhatsappService],
})
export class WhatsappModule { }
