import { Module } from '@nestjs/common';
import { MinioService } from 'src/minio/minio.service';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  controllers: [ContactController],
  providers: [ContactService, MinioService],
  exports: [ContactService],
})
export class ContactModule {}
