import { Model } from 'objection';
import { CustomerSettingsModel } from 'src/customer-settings/customer-settings-model';
import { BaseModel } from 'src/database/base.model';

export class CustomerModel extends BaseModel {
    static tableName = 'customers';

    name: string;
    email: string;
    address: string;
    contact: string;
    avatar: string;
    optional_contact: string;

    static relationMappings = () => ({
        customerSettings: {
            relation: Model.HasManyRelation,
            modelClass: CustomerSettingsModel,
            join: {
                from: 'customers.id',
                to: 'customer_settings.customer_id',
            },
        },
    });
}

CustomerModel.relationMappings();
