import { Module } from '@nestjs/common';
import { UserEmailsService } from './user-emails.service';
import { UserEmailsController } from './user-emails.controller';

@Module({
  controllers: [UserEmailsController],
  providers: [UserEmailsService],
})
export class UserEmailsModule {}
