import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { ModelClass, raw } from 'objection';
import { RepeatIntervalType } from 'src/database/enums/tasks';
import { TaskModel } from 'src/task/task.model';
import { ChronJobModel } from './chron-jobs.model';
import { CreateChronJobDto } from './dto/create-chron-job.dto';
import { UpdateChronJobDto } from './dto/update-chron-job.dto';

@Injectable()
export class ChronJobsService {
    private readonly logger = new Logger(ChronJobsService.name);

    constructor(
        @Inject('ChronJobModel') private chronJobModelClass: ModelClass<ChronJobModel>,
        @Inject('TaskModel') private taskModelClass: ModelClass<TaskModel>,
    ) {}

    async create(createChronJobDto: CreateChronJobDto) {
        createChronJobDto['next_run_time'] = createChronJobDto.start_date;
        const job = await this.chronJobModelClass.query().insert(createChronJobDto);
        return job;
    }

    async findAll(params = {}) {
        const jobs = await this.chronJobModelClass.query().filter(params).sort(params).paginate(params).find();
        return jobs;
    }

    async findOne(id: number) {
        return await this.chronJobModelClass.query().findById(id).find();
    }

    async update(id: number, updateChronJobDto: UpdateChronJobDto) {
        return await this.chronJobModelClass.query().findById(id).update(updateChronJobDto);
    }

    async remove(id: number) {
        return await this.chronJobModelClass.query().softDelete(id);
    }

    // @Cron(CronExpression.EVERY_6_HOURS, {
    @Cron(CronExpression.EVERY_SECOND, {
        name: 'RepeatTasks',
        timeZone: 'Asia/Dhaka',
    })
    async handleRepeatTask() {
        const today = DateTime.now().startOf('day').plus({ hours: 6 });

        // Get repeatTasks due for today, type, is_active,  before end_date
        const jobs = await this.chronJobModelClass
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
            await this.chronJobModelClass
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
