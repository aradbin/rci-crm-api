import { Module } from '@nestjs/common';
import { MinioService } from 'src/minio/minio.service';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, MinioService],
})
export class CustomerModule {}
