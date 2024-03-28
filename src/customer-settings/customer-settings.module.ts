import { Module } from '@nestjs/common';
import { CustomerSettingsController } from './customer-settings.controller';
import { CustomerSettingsService } from './customer-settings.service';

@Module({
    controllers: [CustomerSettingsController],
    providers: [CustomerSettingsService],
    exports: [CustomerSettingsService],
})
export class CustomerSettingsModule {}
