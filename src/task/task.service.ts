import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ModelClass } from 'objection';
import { TaskModel } from './task.model';

@Injectable()
export class TaskService {
  constructor(@Inject('TaskModel') private modelClass: ModelClass<TaskModel>) { }

  async create(createTaskDto: CreateTaskDto) {
    return await this.modelClass.query().insert(createTaskDto);
  }

  async findAll(params: any = {}) {
    return await this.modelClass.query().filter(params).sort(params).paginate(params).withGraphFetched('customer').withGraphFetched('assignee').withGraphFetched('reporter').find();
  }

  async count(params: any = {}) {
    return await this.modelClass.query().filter(params).where('deleted_at', null).select('status').count('id as count').groupBy('status');
  }

  async findOne(id: number) {
    return await this.modelClass.query().findById(id).withGraphFetched('customer').withGraphFetched('assignee').withGraphFetched('reporter').find();
  }

  async update(user_id: number, id: number, updateTaskDto: UpdateTaskDto) {
    if (updateTaskDto.hasOwnProperty('status') || updateTaskDto.hasOwnProperty('running')) {
      const task = await this.modelClass.query().findById(id).find();
      if (updateTaskDto.hasOwnProperty('status') && task?.status !== updateTaskDto?.status) {
        const time_log = task?.time_log;
        if (updateTaskDto.status === 'inprogress') {
          await this.stopAll(user_id, task?.assignee_id, id);
          time_log.push({ action: 'start', created_at: new Date(), created_by: user_id });
          updateTaskDto = { ...updateTaskDto, running: true, time_log: JSON.stringify(time_log) };
        } else {
          time_log.push({ action: 'stop', created_at: new Date(), created_by: user_id });
          updateTaskDto = { ...updateTaskDto, running: false, time_log: JSON.stringify(time_log) };
        }
      } else if (updateTaskDto.hasOwnProperty('running') && task?.running !== updateTaskDto?.running) {
        const time_log = task?.time_log;
        if (updateTaskDto.running) {
          await this.stopAll(user_id, task?.assignee_id, id);
          time_log.push({ action: 'start', created_at: new Date(), created_by: user_id });
          updateTaskDto = { ...updateTaskDto, running: true, time_log: JSON.stringify(time_log) };
        } else {
          time_log.push({ action: 'stop', created_at: new Date(), created_by: user_id });
          updateTaskDto = { ...updateTaskDto, running: false, time_log: JSON.stringify(time_log) };
        }
      }
    }

    return await this.modelClass.query().findById(id).update(updateTaskDto);
  }

  async remove(id: number) {
    return await this.modelClass.query().softDelete(id);
  }

  async stopAll(user_id: number, assignee_id: number, id: number) {
    const tasks = await this.modelClass.query().where('running', true).where('assignee_id', assignee_id).where('id', '!=', id).find();
    tasks?.map(async (item: any) => {
      const time_log = item.time_log;
      if (time_log.length > 0 && time_log[time_log.length - 1].action === 'start') {
        time_log.push({ action: 'stop', created_at: new Date(), created_by: user_id });
      }
      await this.modelClass.query().findById(item.id).update({ running: false, time_log: JSON.stringify(time_log) });
    });
  }
}
