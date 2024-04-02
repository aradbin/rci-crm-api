import { Model } from 'objection';
import { CustomerModel } from 'src/customer/customer.model';
import { BaseModel } from 'src/database/base.model';
import { SettingsModel } from 'src/settings/settings.model';

export class CustomerSettingsModel extends BaseModel {
    static tableName = 'customer_settings';

    metadata: any;

    static relationMappings = {
        customer: {
            relation: Model.BelongsToOneRelation,
            modelClass: CustomerModel,
            join: {
                from: 'customer_settings.customer_id',
                to: 'customers.id',
            },
        },

        settings: {
            relation: Model.BelongsToOneRelation,
            modelClass: SettingsModel,
            join: {
                from: 'customer_settings.settings_id',
                to: 'settings.id',
            },
        },
    };
}
