import { Model } from 'objection';
import { BaseModel } from 'src/database/base.model';
import { UserModel } from 'src/user/user.model';

export class MessageConversationModel extends BaseModel {
  static tableName = 'user_conversations';

  user_one: number
  user_two: number

  static relationMappings = {
    userOne: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'user_conversations.user_one',
        to: 'users.id',
      },
    },
    userTwo: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'user_conversations.user_two',
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
