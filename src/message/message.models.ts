import { Model } from 'objection';
import { BaseModel } from 'src/database/base.model';
import { UserModel } from 'src/user/user.model';

export class MessageConversationModel extends BaseModel {
  static tableName = 'user_conversations';

  static relationMappings = {
    recipient: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'user_conversations.user_id',
        to: 'users.id',
      },
    }
  };
}

export class MessageModel extends BaseModel {
  static tableName = 'user_messages';

  conversation_id: number;
  message: string;
}
