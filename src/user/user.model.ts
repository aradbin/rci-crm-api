import { Model } from 'objection';
import { BaseModel } from 'src/database/base.model';
import { TaskUserModel } from 'src/task/task-user.model';
import { TaskModel } from 'src/task/task.model';
import { UserSettingsModel } from 'src/user-settings/user-settings.model';

export class UserModel extends BaseModel {
  static tableName = 'users';

  email: string;
  username: string;
  password: string;

  static relationMappings = () => ({
    userSettings: {
      relation: Model.HasManyRelation,
      modelClass: UserSettingsModel,
      join: {
        from: 'users.id',
        to: 'user_settings.user_id',
      },
      filter: (queryBuilder: any) => {
        queryBuilder.where('user_settings.deleted_at', null);
      },
    },
    tasks: {
      relation: Model.HasManyRelation,
      modelClass: TaskUserModel,
      join: {
        from: 'users.id',
        to: 'task_users.user_id',
      },
    },
    runningTask: {
      relation: Model.ManyToManyRelation,
      modelClass: TaskModel,
      join: {
        from: 'users.id',
        through: {
          from: 'task_users.user_id',
          to: 'task_users.task_id',
        },
        to: 'tasks.id',
      },
      filter: (queryBuilder: any) => {
        queryBuilder
          .where('tasks.running', true)
          .where('tasks.status', 'inprogress')
          .where('task_users.type', 'assignee');
      },
    },
  });
}
