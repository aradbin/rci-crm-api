import "dotenv/config";
import { Global, Module } from "@nestjs/common";
import { UserModel } from "../users/user.model";
import { Model, knexSnakeCaseMappers } from "objection";
import Knex from 'knex';
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
    provide: "KnexConnection",
    useFactory: async () => {
      const knex = Knex({
        client: "pg",
        connection: process.env.DB_URL,
        // ...knexSnakeCaseMappers()
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
