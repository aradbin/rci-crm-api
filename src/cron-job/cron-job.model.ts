import { BaseModel } from 'src/database/base.model';

export class CronJobModel extends BaseModel {
    static tableName = 'cron_jobs';

    metadata: any;

    next_run_time: Date;
}
