import { Module } from '@nestjs/common';
import { EmailSettingsService } from './email-settings.service';
import { EmailSettingsController } from './email-settings.controller';

@Module({
  controllers: [EmailSettingsController],
  providers: [EmailSettingsService],
  exports: [EmailSettingsService],
})
export class EmailSettingsModule { }