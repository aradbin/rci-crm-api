import { Inject, Injectable, Logger } from '@nestjs/common';
import { ModelClass } from 'objection';
import { TaskModel } from 'src/task/task.model';
import { CronJobModel } from './cron-job.model';
import { CreateCronJobDto } from './dto/create-cron-job.dto';
import { UpdateCronJobDto } from './dto/update-cron-job.dto';

@Injectable()
export class CronJobService {
    private readonly logger = new Logger(CronJobService.name);

    constructor(
        @Inject('CronJobModel') private cronJobModelClass: ModelClass<CronJobModel>,
        @Inject('TaskModel') private taskModelClass: ModelClass<TaskModel>,
    ) {}

    async create(createCronJobDto: CreateCronJobDto) {
        return await this.cronJobModelClass.query().insert(createCronJobDto);
    }

    async findAll(params = {}) {
        return await this.cronJobModelClass.query().paginate(params).filter(params).find();
    }

    async findOne(id: number) {
        return await this.cronJobModelClass.query().findById(id).find();
    }

    async update(id: number, updateCronJobDto: UpdateCronJobDto) {
        return await this.cronJobModelClass.query().findById(id).update(updateCronJobDto);
    }

    async remove(id: number) {
        return await this.cronJobModelClass.query().softDelete(id);
    }

    // @Cron(CronExpression.EVERY_SECOND, {
    //     name: 'RepeatTasks',
    //     timeZone: 'Asia/Dhaka',
    // })
    async handleServiceTask() {
        const jobs = await this.cronJobModelClass.query().where('type', 'service').where('next_run_time', new Date()).where('is_active', true).find();

        jobs.forEach(async (job) => {
            const task = job['meta_data'];
            // task['due_date'] = DateTime.now().plus({ days: task['due_date'] }).toJSDate();
            await this.taskModelClass.query().insert(task);

            // update next_run date
            await this.cronJobModelClass
                .query()
                .findById(job.id)
                // .update({
                //     next_run_time: this.calculateRepeatNext(today, job.repeat_interval, job.repeat_amount).toJSDate(),
                // });
        });

        console.log('repeat-tasks job ran successfully');
    }

    // private calculateRepeatNext(today: DateTime, repeatType: RepeatIntervalType, amount: number) {
    //     if (repeatType == RepeatIntervalType.DAILY) {
    //         return today.plus({ days: amount });
    //     }

    //     if (repeatType == RepeatIntervalType.WEEKLY) {
    //         return today.plus({ weeks: amount });
    //     }

    //     if (repeatType == RepeatIntervalType.MONTHLY) {
    //         return today.plus({ months: amount });
    //     }
    // }
}
