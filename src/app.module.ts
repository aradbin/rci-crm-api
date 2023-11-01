import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { EmailModule } from './email/email.module';
import { SettingsModule } from './settings/settings.module';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { TaskModule } from './task/task.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { CustomerModule } from './customer/customer.module';
import { EventsModule } from './event-gateway/events.gateway.module';

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
    CustomerModule,
    EventsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
