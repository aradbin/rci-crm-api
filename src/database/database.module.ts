import { Global, Module } from '@nestjs/common';
import Knex from 'knex';
import { Model } from 'objection';
import { ContactModel } from 'src/contact/contact.model';
import { CronJobModel } from 'src/cron-job/cron-job.model';
import { CustomerContactModel } from 'src/customer-contact/customer-contact.model';
import { CustomerSettingsModel } from 'src/customer-settings/customer-settings.model';
import { CustomerModel } from 'src/customer/customer.model';
import { EmailModel } from 'src/email/email.model';
import { MessageConversationModel, MessageModel } from 'src/message/message.models';
import { PhoneLogModel } from 'src/phone/phone.model';
import { SettingsModel } from 'src/settings/settings.model';
import { TaskUserModel } from 'src/task/task-user.model';
import { TaskModel } from 'src/task/task.model';
import { UserSettingsModel } from 'src/user-settings/user-settings.model';
import { VoipLogModel } from 'src/voip/voip.model';
import { WhatsappConversationModel, WhatsappMessageModel } from 'src/whatsapp/whatsapp.models';
import { UserModel } from '../user/user.model';

const models = [
  UserModel,
  SettingsModel,
  UserSettingsModel,
  CustomerSettingsModel,
  CronJobModel,
  EmailModel,
  CustomerModel,
  ContactModel,
  CustomerContactModel,
  TaskModel,
  TaskUserModel,
  WhatsappMessageModel,
  WhatsappConversationModel,
  MessageModel,
  MessageConversationModel,
  VoipLogModel,
  PhoneLogModel,
];

const modelProviders = models.map((model) => {
  return {
    provide: model.name,
    useValue: model,
  };
});

const providers = [
  ...modelProviders,
  {
    provide: 'KnexConnection',
    useFactory: async () => {
      const knex = Knex({
        client: 'pg',
        connection: {
          host: process.env.POSTGRES_HOST,
          port: parseInt(process.env.POSTGRES_PORT),
          user: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          ssl: {
            rejectUnauthorized: false,
          },
        },
        pool: {
          min: 0,
          max: 10,
          idleTimeoutMillis: 30000,
          acquireTimeoutMillis: 60000,
        },
      });

      Model.knex(knex);
      return knex;
    },
  },
];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class DatabaseModule {}
