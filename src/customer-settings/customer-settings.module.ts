import { Module } from '@nestjs/common';
import { CronJobModule } from 'src/cron-job/cron-job.module';
import { SettingsModule } from 'src/settings/settings.module';
import { CustomerSettingsController } from './customer-settings.controller';
import { CustomerSettingsService } from './customer-settings.service';

@Module({
    imports: [SettingsModule, CronJobModule],
    controllers: [CustomerSettingsController],
    providers: [CustomerSettingsService],
    exports: [CustomerSettingsService],
})
export class CustomerSettingsModule {}
