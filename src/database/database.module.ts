import { Global, Module } from '@nestjs/common';
import { Model } from 'objection';
import Knex from 'knex';
import { UserMessageModel, UserModel } from '../user/user.model';
import { SettingsModel } from 'src/settings/settings.model';
import { UserSettingsModel } from 'src/user-settings/user-settings.model';
import { CustomerModel } from 'src/customer/customer.model';
import { EmailModel } from 'src/email/email.model';
import { TaskModel } from 'src/task/task.model';
import { WhatsappMessageModel } from 'src/whatsapp/whatsapp.models';

const models = [UserModel, SettingsModel, UserSettingsModel, EmailModel, CustomerModel, TaskModel, UserMessageModel, WhatsappMessageModel];

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
        debug: true,
        connection: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
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
export class DatabaseModule { }
