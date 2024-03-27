import { Module } from '@nestjs/common';
import { CustomerSettingsModule } from 'src/customer-settings/customer-settings.module';
import { MinioService } from 'src/minio/minio.service';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
    imports: [CustomerSettingsModule],
    controllers: [CustomerController],
    providers: [CustomerService, MinioService],
})
export class CustomerModule {}
