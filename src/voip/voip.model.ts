import { Model } from 'objection';
import { CustomerModel } from 'src/customer/customer.model';
import { BaseModel } from 'src/database/base.model';
import { UserModel } from 'src/user/user.model';

export class VoipLogModel extends BaseModel {
  static tableName = 'voip_logs';

  call_id: string;
  remote_number: string;
  local_number: string;
  state: string;

  log: any;
  received_by: number;
  customer_id: number;
  customer: any;

  static relationMappings = () => ({
    received: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'voip_logs.received_by',
        to: 'users.id',
      },
    },
    customer: {
      relation: Model.BelongsToOneRelation,
      modelClass: CustomerModel,
      join: {
        from: 'voip_logs.customer_id',
        to: 'customers.id',
      },
    }
  });
}
