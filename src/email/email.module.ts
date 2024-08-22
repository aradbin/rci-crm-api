import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { AccountModule } from 'src/account/account.module';
import { RequestModule } from 'src/request/request.module';

@Module({
  imports: [AccountModule, RequestModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
