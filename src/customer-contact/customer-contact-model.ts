import { Model } from 'objection';
import { ContactModel } from 'src/contact/contact.model';
import { CustomerModel } from 'src/customer/customer.model';
import { BaseModel } from 'src/database/base.model';

export class CustomerContactModel extends BaseModel {
  static tableName = 'customer_contacts';

  metadata: any;

  static relationMappings = {
    customer: {
      relation: Model.BelongsToOneRelation,
      modelClass: CustomerModel,
      join: {
        from: 'customer_contacts.customer_id',
        to: 'customers.id',
      },
    },

    contact: {
      relation: Model.BelongsToOneRelation,
      modelClass: ContactModel,
      join: {
        from: 'customer_contacts.contact_id',
        to: 'contacts.id',
      },
    },
  };
}
