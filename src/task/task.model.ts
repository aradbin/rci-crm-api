import { Model } from 'objection';
import { CustomerModel } from 'src/customer/customer.model';
import { BaseModel } from 'src/database/base.model';
import { TaskStatus } from 'src/database/enums/tasks';
import { UserModel } from 'src/user/user.model';

export class TaskModel extends BaseModel {
  static tableName = 'tasks';

  title: string;
  due_date: Date;
  priority: number;
  description: string;

  metadata: any;
  attachments: any;
  activity_log: any;
  time_log: any;

  status: TaskStatus;
  running: boolean;

  parent_id: number;
  customer_id: number;
  assignee_id: number;
  reporter_id: number;
  type_id: any;

  static relationMappings = () => ({
    customer: {
      relation: Model.BelongsToOneRelation,
      modelClass: CustomerModel,
      join: {
        from: 'tasks.customer_id',
        to: 'customers.id',
      },
    },
    assignee: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'tasks.assignee_id',
        to: 'users.id',
      },
    },
    reporter: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'tasks.reporter_id',
        to: 'users.id',
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
    }
    // type: {
    //   relation: Model.BelongsToOneRelation,
    //   modelClass: SettingsModel,
    //   join: {
    //     from: 'tasks.type_id',
    //     to: 'settings.id',
    //   },
    // },
  });
}

TaskModel.relationMappings();
