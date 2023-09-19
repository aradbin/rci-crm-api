import { BaseModel } from "src/database/base.model";
import { UserSettingsModel } from "src/user-settings/user-settings.model";

export class UserModel extends BaseModel {
  static tableName = 'users';

  id: number;
  email: string;
  username: string;
  password: string;

  static relationMappings = {
    userSettings: {
      relation: this.HasManyRelation,
      modelClass: UserSettingsModel,
      join: {
        from: 'users.id',
        to: 'user_settings.user_id'
      }
    }
  };
}