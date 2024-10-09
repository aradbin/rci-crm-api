import { Model } from 'objection';
import { CustomerModel } from 'src/customer/customer.model';
import { BaseModel } from 'src/database/base.model';
import { TaskStatus } from 'src/database/enums/tasks';
import { SettingsModel } from 'src/settings/settings.model';
import { UserModel } from 'src/user/user.model';
import { TaskUserModel } from './task-user.model';

export class TaskModel extends BaseModel {
  static tableName = 'tasks';

  title: string;
  due_date: Date;
  priority: number;
  description: string;

  metadata: any;
  attachments: string[];
  activity_log: any;
  time_log: any;

  status: TaskStatus;
  running: boolean;

  parent_id: number;
  customer_id: number;
  settings_id: number;

  billable: boolean;
  bill_amount: number;

  static relationMappings = () => ({
    customer: {
      relation: Model.BelongsToOneRelation,
      modelClass: CustomerModel,
      join: {
        from: 'tasks.customer_id',
        to: 'customers.id',
      },
    },
    taskUsers: {
      relation: Model.HasManyRelation,
      modelClass: TaskUserModel,
      join: {
        from: 'tasks.id',
        to: 'task_users.task_id',
      },
    },
    creator: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'tasks.created_by',
        to: 'users.id',
      },
    },
    settings: {
      relation: Model.BelongsToOneRelation,
      modelClass: SettingsModel,
      join: {
        from: 'tasks.settings_id',
        to: 'settings.id',
      },
    },
    subTasks: {
      relation: Model.HasManyRelation,
      modelClass: TaskModel,
      join: {
        from: 'tasks.id',
        to: 'tasks.parent_id',
      },
    },
    parentTask: {
      relation: Model.BelongsToOneRelation,
      modelClass: TaskModel,
      join: {
        from: 'tasks.parent_id',
        to: 'tasks.id',
      },
    },
  });
}

TaskModel.relationMappings();
