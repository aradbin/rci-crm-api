import { Module } from '@nestjs/common';
import { CustomerContactModule } from 'src/customer-contact/customer-contact.module';
import { MinioService } from 'src/minio/minio.service';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  imports: [CustomerContactModule],
  controllers: [ContactController],
  providers: [ContactService, MinioService],
})
export class ContactModule {}
