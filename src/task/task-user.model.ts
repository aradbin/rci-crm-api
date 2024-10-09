import { Model } from 'objection';
import { BaseModel } from 'src/database/base.model';
import { UserModel } from 'src/user/user.model';
import { TaskModel } from './task.model';

export class TaskUserModel extends BaseModel {
  static tableName = 'task_users';

  static relationMappings = () => ({
    task: {
      relation: Model.BelongsToOneRelation,
      modelClass: TaskModel,
      join: {
        from: 'tasks.id',
        to: 'task_users.task_id',
      },
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'users.id',
        to: 'task_users.user_id',
      },
    },
  });
}
