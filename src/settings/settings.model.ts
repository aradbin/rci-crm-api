import { Model } from "objection";
import { BaseModel } from "src/database/base.model";
import { UserSettingsModel } from "src/user-settings/user-settings.model";

export class SettingsModel extends BaseModel {
  static tableName = 'settings';

  metadata: any;

  static relationMappings = {
    parent: {
      relation: Model.BelongsToOneRelation,
      modelClass: SettingsModel,
      join: {
        from: 'settings.parent_id',
        to: 'settings.id'
      }
    },
    children: {
      relation: Model.HasManyRelation,
      modelClass: SettingsModel,
      join: {
        from: 'settings.id',
        to: 'settings.parent_id'
      }
    },
    userSettings: {
      relation: Model.HasManyRelation,
      modelClass: UserSettingsModel,
      join: {
        from: 'settings.id',
        to: 'user_settings.settings_id'
      }
    },
    // tasks: {
    //   relation: Model.HasManyRelation,
    //   modelClass: TaskModel,
    //   join: {
    //     from: 'settings.id',
    //     to: 'tasks.type_id'
    //   }
    // }
  };
}