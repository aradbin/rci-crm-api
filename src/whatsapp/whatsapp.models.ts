import { CustomerModel } from 'src/customer/customer.model';
import { BaseModel } from 'src/database/base.model';
import { UserModel } from 'src/user/user.model';

export class WhatsappBusinessNumberModel extends BaseModel {
  static tableName = 'whatsapp_business_numbers';

  name: string;
  phone_number: string;
  phone_number_id: string;
  access_token: string;
  whatsapp_business_account_id: string;
}

export class WhatsappUserModel extends BaseModel {
  static tableName = 'whatsapp_users';

  user_id: number;
  whatsapp_business_number_id: number;

  static relationMappings = {
    user: {
      relation: this.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'whatsapp_users.user_id',
        to: 'users.id',
      },
    },

    whatsapp_business_number: {
      relation: this.BelongsToOneRelation,
      modelClass: WhatsappBusinessNumberModel,
      join: {
        from: 'whatsapp_users.whatsapp_business_number_id',
        to: 'whatsapp_business_numbers.id',
      },
    },
  };
}

export class WhatsappConversationModel extends BaseModel {
  static tableName = 'whatsapp_conversations';

  customer_id: number;
  whatsapp_business_number_id: number;

  static relationMappings = {
    customer: {
      relation: this.BelongsToOneRelation,
      modelClass: CustomerModel,
      join: {
        from: 'whatsapp_conversations.customer_id',
        to: 'customers.id',
      },
    },

    whatsapp_business_number: {
      relation: this.BelongsToOneRelation,
      modelClass: WhatsappBusinessNumberModel,
      join: {
        from: 'whatsapp_conversations.whatsapp_business_number_id',
        to: 'whatsapp_business_numbers.id',
      },
    },
  };
}

export class WhatsappMessageModel extends BaseModel {
  static tableName = 'whatsapp_messages';

  sender_id: number;
  receiver_id: number;
  message_id: string;
  context_message_id: string;

  message_body: string;

  message_type: string;
  is_sent: boolean;
  is_read: boolean;

  payload: any;
  response: any;
  attachments: any;

  static relationMappings = {
    sender: {
      relation: this.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'whatsapp_messages.sender_id',
        to: 'users.id',
      },
    },

    receiver: {
      relation: this.BelongsToOneRelation,
      modelClass: CustomerModel,
      join: {
        from: 'whatsapp_messages.receiver_id',
        to: 'customers.id',
      },
    },
  };
}
