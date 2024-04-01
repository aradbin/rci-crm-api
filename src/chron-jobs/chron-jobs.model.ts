import { BaseModel } from 'src/database/base.model';
import { RepeatIntervalType } from 'src/database/enums/tasks';

export class ChronJobModel extends BaseModel {
    static tableName = 'chron_jobs';

    type: string;
    title: string;
    task_duration: number;
    meta_data: any;

    start_date: Date;
    end_date: Date;
    is_active: boolean;
    next_run_time: Date;
    repeat_amount: number;
    repeat_interval: RepeatIntervalType;
}
