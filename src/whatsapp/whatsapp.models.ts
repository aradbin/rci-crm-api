import { Model } from 'objection';
import { BaseModel } from 'src/database/base.model';
import { SettingsModel } from 'src/settings/settings.model';
import { UserModel } from 'src/user/user.model';

export class WhatsappMessageModel extends BaseModel {
  static tableName = 'whatsapp_messages';

  conversation_id: number;
  message_id: string;
  payload: any;
  status: any;

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

  settings_id: number;
  recipient_id: string;

  static relationMappings = {
    settings: {
      relation: Model.BelongsToOneRelation,
      modelClass: SettingsModel,
      join: {
        from: 'whatsapp_conversations.settings_id',
        to: 'settings.id',
      },
    },
  };
}
