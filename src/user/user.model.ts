import { BaseModel } from 'src/database/base.model';
import { UserSettingsModel } from 'src/user-settings/user-settings.model';

export class UserModel extends BaseModel {
  static tableName = 'users';

  id: number;
  email: string;
  username: string;
  password: string;

  static relationMappings = {
    userSettings: {
      relation: this.HasManyRelation,
      modelClass: UserSettingsModel,
      join: {
        from: 'users.id',
        to: 'user_settings.user_id',
      },
    },
  };
}

export class UserMessageModel extends BaseModel {
  static tableName = 'user_messages';

  id: number;
  recipient_id: number;

  message_body: string;
  message_type: string;
  message_status: string;
  context_message_id: string;

  attachments: any;

  static relationMappings = {
    sender: {
      relation: this.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'user_messages.created_by',
        to: 'users.id',
      },
    },

    receiver: {
      relation: this.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'user_messages.recipient_id',
        to: 'users.id',
      },
    },
  };
}
