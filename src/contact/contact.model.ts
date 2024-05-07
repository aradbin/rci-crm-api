import { Model } from 'objection';
import { CustomerContactModel } from 'src/customer-contact/customer-contact-model';
import { BaseModel } from 'src/database/base.model';

export class ContactModel extends BaseModel {
  static tableName = 'contacts';

  name: string;
  email: string;
  address: string;
  contact: string;
  avatar: string;

  static relationMappings = () => ({
    customerContacts: {
      relation: Model.HasManyRelation,
      modelClass: CustomerContactModel,
      join: {
        from: 'contacts.id',
        to: 'customer_contacts.contact_id',
      },
    },
  });
}

ContactModel.relationMappings();
