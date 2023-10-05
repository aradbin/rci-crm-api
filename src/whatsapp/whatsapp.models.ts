import { CustomerModel } from 'src/customer/customer.model';
import { BaseModel } from 'src/database/base.model';
import { UserModel } from 'src/user/user.model';

export class WhatsappSettingModel extends BaseModel {
  static tableName = 'whatsapp_settings';

  name: string;
  phone_number: string;
  phone_number_id: string;
  access_token: string;

  // static relationMappings = {
  //   users: {
  //     relation: this.HasManyRelation,
  //     modelClass: UserModel,
  //     join: {
  //       from: 'users.id',
  //       to: 'whatsapp_users.user_id',
  //     },
  //   },
  // };
}

export class WhatsappUserModel extends BaseModel {
  static tableName = 'whatsapp_users';

  user_id: number;
  whatsapp_setting_id: number;

  static relationMappings = {
    user: {
      relation: this.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'whatsapp_users.user_id',
        to: 'users.id',
      },
    },

    whatsapp_setting: {
      relation: this.BelongsToOneRelation,
      modelClass: WhatsappSettingModel,
      join: {
        from: 'whatsapp_users.whatsapp_setting_id',
        to: 'whatsapp_settings.id',
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
