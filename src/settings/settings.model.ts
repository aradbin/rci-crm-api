import { Model } from "objection";
import { CustomerSettingsModel } from "src/customer-settings/customer-settings.model";
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
    },
    customerSettings: {
      relation: Model.HasManyRelation,
      modelClass: CustomerSettingsModel,
      join: {
        from: 'settings.id',
        to: 'customer_settings.settings_id'
      }
    },
    customerSettingsSingle: {
      relation: Model.HasOneRelation,
      modelClass: CustomerSettingsModel,
      join: {
        from: 'settings.id',
        to: 'customer_settings.settings_id'
      }
    }
  };
}