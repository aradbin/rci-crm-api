import { Model } from 'objection';
import { BaseModel } from 'src/database/base.model';
import { SettingsModel } from 'src/settings/settings.model';

export class CallLogModel extends BaseModel {
  static tableName = 'call_logs';

  settings_id: number;
  customer_id: number;
  number: string;
  log: any;
  note: string;

  static relationMappings = () => ({
    settings: {
      relation: Model.BelongsToOneRelation,
      modelClass: SettingsModel,
      join: {
        from: 'call_logs.settings_id',
        to: 'settings.id',
      },
    },
  });
}
