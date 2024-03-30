import { Model } from "objection";
import { BaseModel } from "src/database/base.model";

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
    }
  };
}