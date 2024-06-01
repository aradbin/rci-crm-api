import { Model } from 'objection';
import { CustomerModel } from 'src/customer/customer.model';
import { BaseModel } from 'src/database/base.model';

export class CustomerSettingsModel extends BaseModel {
    static tableName = 'customer_settings';

    customer_id: number;
    settings_id: number;
    is_active: boolean;
    metadata: any;

    static relationMappings = {
        customer: {
            relation: Model.BelongsToOneRelation,
            modelClass: CustomerModel,
            join: {
                from: 'customer_settings.customer_id',
                to: 'customers.id',
            },
        }
    };
}
