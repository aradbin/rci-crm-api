import { Module } from '@nestjs/common';
import { CronJobModule } from 'src/cron-job/cron-job.module';
import { CustomerSettingsController } from './customer-settings.controller';
import { CustomerSettingsService } from './customer-settings.service';

@Module({
    imports: [CronJobModule],
    controllers: [CustomerSettingsController],
    providers: [CustomerSettingsService],
    exports: [CustomerSettingsService],
})
export class CustomerSettingsModule {}
