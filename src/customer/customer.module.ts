import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController, RpcController } from './customer.controller';

@Module({
  controllers: [CustomerController, RpcController],
  providers: [CustomerService],
})
export class CustomerModule {}
