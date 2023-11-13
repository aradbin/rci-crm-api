import { Model } from 'objection';
import { CustomerModel } from 'src/customer/customer.model';
import { BaseModel } from 'src/database/base.model';
import { UserModel } from 'src/user/user.model';

export class WhatsappMessageModel extends BaseModel {
  static tableName = 'whatsapp_messages';

  conversation_id: number;

  message_id: string;
  message_body: string;
  message_type: string;
  message_status: string;
  context_message_id: string;

  payload: any;
  response: any;
  attachments: any;

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'whatsapp_messages.created_by',
        to: 'users.id',
      },
    },
  };
}

export class WhatsappConversationModel extends BaseModel {
  static tableName = 'whatsapp_conversations';

  static relationMappings = {
    customer: {
      relation: Model.BelongsToOneRelation,
      modelClass: CustomerModel,
      join: {
        from: 'whatsapp_conversations.recipient_number',
        to: 'customers.contact',
      },
    },
    messages: {
      relation: Model.HasManyRelation,
      modelClass: WhatsappMessageModel,
      join: {
        from: 'whatsapp_conversations.id',
        to: 'whatsapp_messages.conversation_id',
      },
    }

  };
}
