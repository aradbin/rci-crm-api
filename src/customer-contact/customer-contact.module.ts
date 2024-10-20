import { Module } from '@nestjs/common';
import { ContactModule } from 'src/contact/contact.module';
import { CustomerContactController } from './customer-contact.controller';
import { CustomerContactService } from './customer-contact.service';

@Module({
  imports: [ContactModule],
  controllers: [CustomerContactController],
  providers: [CustomerContactService],
})
export class CustomerContactModule {}
