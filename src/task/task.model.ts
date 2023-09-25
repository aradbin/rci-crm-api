import { Model } from 'objection';
import { CustomerModel } from 'src/customer/customer.model';
import { BaseModel } from 'src/database/base.model';
import { TaskStatus } from 'src/database/enums/tasks';
import { UserModel } from 'src/user/user.model';

export class TaskModel extends BaseModel {
  static tableName = 'tasks';

  title?: string;
  due_date?: Date;
  priority?: number;
  description?: string;

  metadata?: any;
  attachments?: any;
  activity_log?: any;

  status?: TaskStatus;

  customer_id?: number;
  assignee_id?: number;

  static relationMappings = {
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
  };
}
