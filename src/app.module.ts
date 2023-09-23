import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { EmailModule } from './email/email.module';
import { SettingsModule } from './settings/settings.module';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { TasksModule } from './tasks/tasks.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { UserEmailsModule } from './user-emails/user-emails.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    EmailModule,
    SettingsModule,
    UserSettingsModule,
    TasksModule,
    WhatsappModule,
    UserEmailsModule,
    CustomerModule,
  ],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: JwtAuthGuard,
  //   },
  // ],
})
export class AppModule {}
