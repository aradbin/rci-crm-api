import { Model } from 'objection';
import { CustomerModel } from 'src/customer/customer.model';
import { BaseModel } from 'src/database/base.model';
import { SettingsModel } from 'src/settings/settings.model';

export class PhoneLogModel extends BaseModel {
  static tableName = 'phone_logs';

  settings_id: number;
  customer_id: number;
  number: string;
  type: string;
  log: any;
  note: string;

  static relationMappings = () => ({
    settings: {
      relation: Model.BelongsToOneRelation,
      modelClass: SettingsModel,
      join: {
        from: 'phone_logs.settings_id',
        to: 'settings.id',
      },
    },
    customer: {
      relation: Model.BelongsToOneRelation,
      modelClass: CustomerModel,
      join: {
        from: 'phone_logs.customer_id',
        to: 'customers.id',
      },
    },
  });
}
