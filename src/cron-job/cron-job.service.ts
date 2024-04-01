import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { ModelClass, raw } from 'objection';
import { RepeatIntervalType } from 'src/database/enums/tasks';
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
        createCronJobDto['next_run_time'] = createCronJobDto.start_date;
        const job = await this.cronJobModelClass.query().insert(createCronJobDto);
        return job;
    }

    async findAll(params = {}) {
        const jobs = await this.cronJobModelClass.query().filter(params).sort(params).paginate(params).find();
        return jobs;
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

    // @Cron(CronExpression.EVERY_6_HOURS, {
    @Cron(CronExpression.EVERY_SECOND, {
        name: 'RepeatTasks',
        timeZone: 'Asia/Dhaka',
    })
    async handleRepeatTask() {
        const today = DateTime.now().startOf('day').plus({ hours: 6 });

        // Get repeatTasks due for today, type, is_active,  before end_date
        const jobs = await this.cronJobModelClass
            .query()
            .where('type', 'RepeatTasks')
            .where('start_date', '<=', today.toJSDate())
            .where('end_date', '>', today.toJSDate())
            .where(raw("date_trunc('day', next_run_time)::date"), today.toJSDate().toISOString().slice(0, 10))
            .where('is_active', true)
            .find();

        // for each
        jobs.forEach(async (job) => {
            // create the tasks
            const task = job['meta_data'];
            task['due_date'] = DateTime.now().plus({ days: task['due_date'] }).toJSDate();
            await this.taskModelClass.query().insert(task);

            // update next_run date
            await this.cronJobModelClass
                .query()
                .findById(job.id)
                .update({
                    next_run_time: this.calculateRepeatNext(today, job.repeat_interval, job.repeat_amount).toJSDate(),
                });
        });

        console.log('repeat-tasks job ran successfully');
    }

    private calculateRepeatNext(today: DateTime, repeatType: RepeatIntervalType, amount: number) {
        if (repeatType == RepeatIntervalType.DAILY) {
            return today.plus({ days: amount });
        }

        if (repeatType == RepeatIntervalType.WEEKLY) {
            return today.plus({ weeks: amount });
        }

        if (repeatType == RepeatIntervalType.MONTHLY) {
            return today.plus({ months: amount });
        }
    }
}
