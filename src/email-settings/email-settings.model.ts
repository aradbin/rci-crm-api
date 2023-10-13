import { BaseModel } from "src/database/base.model";
import { SettingsModel } from "src/settings/settings.model";
import { UserModel } from "src/user/user.model";

export class EmailSettingsModel extends BaseModel {
  static tableName = 'email_settings';

  id: number;
  name: string;
  host: string;
  username: string;
  password: string;

  static relationMappings = {
    user: {
      relation: this.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'email_settings.user_id',
        to: 'users.id'
      }
    },
  };
}