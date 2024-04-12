import { Model } from 'objection';
import { BaseModel } from 'src/database/base.model';
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
        runningTask: {
            relation: Model.HasOneRelation,
            modelClass: TaskModel,
            join: {
                from: 'users.id',
                to: 'tasks.assignee_id',
            },
            filter: (queryBuilder: any) => {
                queryBuilder.where('tasks.running', true).where('status', 'inprogress');
            },
        },
    });
}

UserModel.relationMappings();
