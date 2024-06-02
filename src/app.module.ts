import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CallModule } from './call/call.module';
import { ContactModule } from './contact/contact.module';
import { CronJobModule } from './cron-job/cron-job.module';
import { CustomerContactModule } from './customer-contact/customer-contact.module';
import { CustomerSettingsModule } from './customer-settings/customer-settings.module';
import { CustomerModule } from './customer/customer.module';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './email/email.module';
import { MessageModule } from './message/message.module';
import { MinioService } from './minio/minio.service';
import { SettingsModule } from './settings/settings.module';
import { SocketModule } from './socket/socket.module';
import { TaskModule } from './task/task.module';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { UserModule } from './user/user.module';
import { VoipModule } from './voip/voip.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    EmailModule,
    SettingsModule,
    UserSettingsModule,
    TaskModule,
    WhatsappModule,
    MessageModule,
    CustomerModule,
    ContactModule,
    CustomerContactModule,
    SocketModule,
    VoipModule,
    CallModule,
    CustomerSettingsModule,
    ScheduleModule.forRoot(),
    CronJobModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    MinioService,
  ],
})
export class AppModule {}
