import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { ModelClass } from 'objection';
import { TaskStatus } from 'src/database/enums/tasks';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';
import { TaskService } from 'src/task/task.service';
import { CronJobModel } from './cron-job.model';
import { CreateCronJobDto } from './dto/create-cron-job.dto';
import { UpdateCronJobDto } from './dto/update-cron-job.dto';

@Injectable()
export class CronJobService {
  constructor(
    @Inject('CronJobModel') private cronJobModelClass: ModelClass<CronJobModel>,
    private taskService: TaskService,
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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'ServiceTask',
    timeZone: 'Asia/Dhaka',
  })
  async handleServiceTask() {
    const jobs = await this.cronJobModelClass
      .query()
      .where('type', 'service')
      .where('next_run_time', new Date())
      .where('is_active', true)
      .find();

    jobs.forEach(async (job) => {
      const createTaskDto: CreateTaskDto = {
        assignee_id: null,
        attachments: null,
        customer_id: job?.metadata?.customer_id,
        description: null,
        due_date: new Date(this.nextDate(job?.metadata?.metadata?.due_date, job?.metadata?.settings?.metadata?.cycle)),
        estimation: job?.metadata?.settings?.metadata?.estimation,
        parent_id: null,
        priority: 3,
        reporter_id: null,
        running: false,
        status: TaskStatus.TODO,
        time_log: null,
        title: job?.metadata?.settings?.name,
        settings_id: null,
        billable: false,
        bill_amount: 0,
      };
      console.log(job);
      await this.taskService.create(createTaskDto, []);
      await this.cronJobModelClass
        .query()
        .findById(job?.id)
        .update({
          next_run_time: this.nextDate(job?.metadata?.metadata?.start_date, job?.metadata?.settings?.metadata?.cycle),
        });
    });
  }

  private nextDate(given_date, cycle) {
    let date = DateTime.fromJSDate(new Date(given_date));
    const today = DateTime.now().plus({ hours: 6 });

    while (date <= today) {
      switch (cycle) {
        case 'daily':
          date = date.plus({ days: 1 });
          break;
        case 'weekly':
          date = date.plus({ weeks: 1 }).set({ weekday: given_date.weekday });
          break;
        case 'monthly':
          date = date.plus({ months: 1 }).set({ day: date.day });
          break;
        case 'quarterly':
          date = date.plus({ months: 3 }).set({ day: date.day });
          break;
        case 'yearly':
          date = date.plus({ years: 1 }).set({ month: date.month, day: date.day });
          break;
        default:
          throw new Error(`Invalid cycle: ${cycle}`);
      }
    }

    return date.toJSDate();
  }
}
