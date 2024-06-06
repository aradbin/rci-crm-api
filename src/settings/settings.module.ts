import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { UserSettingsModule } from 'src/user-settings/user-settings.module';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [EmailModule, UserSettingsModule],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService]
})
export class SettingsModule {}
