import { BaseModel } from "src/database/base.model";
import { SettingsModel } from "src/settings/settings.model";
import { UserModel } from "src/users/user.model";

export class UserSettingsModel extends BaseModel {
  static tableName = 'user_settings';

  static relationMappings = {
    user: {
      relation: this.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'user_settings.user_id',
        to: 'users.id'
      }
    },

    settings: {
      relation: this.BelongsToOneRelation,
      modelClass: SettingsModel,
      join: {
        from: 'user_settings.settings_id',
        to: 'settings.id'
      }
    }
  };
}