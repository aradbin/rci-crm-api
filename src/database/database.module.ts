import { Global, Module } from '@nestjs/common';
import { Model } from 'objection';
import Knex from 'knex';
import { UserModel } from '../users/user.model';
import { SettingsModel } from 'src/settings/settings.model';
import { UserSettingsModel } from 'src/user-settings/user-settings.model';
import { UserEmailModel } from 'src/user-emails/user-email.model';

const models = [UserModel, SettingsModel, UserSettingsModel, UserEmailModel];

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
export class DatabaseModule {}
