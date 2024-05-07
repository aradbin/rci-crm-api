import { Module } from '@nestjs/common';
import { ContactModule } from 'src/contact/contact.module';
import { CronJobModule } from 'src/cron-job/cron-job.module';
import { CustomerContactController } from './customer-contact.controller';
import { CustomerContactService } from './customer-contact.service';

@Module({
  imports: [ContactModule, CronJobModule],
  controllers: [CustomerContactController],
  providers: [CustomerContactService],
  exports: [CustomerContactService],
})
export class CustomerContactModule {}
