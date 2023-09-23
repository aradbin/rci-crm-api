import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { CustomerModel } from './customer.model';

@Module({
  controllers: [CustomerController],
  providers: [
    CustomerService,
    { provide: 'CustomerModel', useValue: CustomerModel },
  ],
})
export class CustomerModule {}
