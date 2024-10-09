import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { MinioService } from 'src/minio/minio.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskUserModel } from './task-user.model';
import { TaskModel } from './task.model';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TaskModel') private modelClass: ModelClass<TaskModel>,
    @Inject('TaskUserModel') private modelClassTaskUser: ModelClass<TaskUserModel>,
    private readonly minioService: MinioService,
  ) {}

  async create(createTaskDto: CreateTaskDto, attachments: Array<Express.Multer.File>) {
    const trx = await this.modelClass.startTransaction();
    try {
      const { assignee_id, reporter_id } = createTaskDto;
      delete createTaskDto.assignee_id;
      delete createTaskDto.reporter_id;

      const task = await this.modelClass.query(trx).insert(createTaskDto);

      const taskUsers = [
        ...assignee_id.map((id) => ({ user_id: id, type: 'assignee' })),
        ...reporter_id.map((id) => ({ user_id: id, type: 'reporter' })),
      ];

      if (taskUsers?.length > 0) {
        await task.$relatedQuery('taskUsers').insert(taskUsers);
      }

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async findAll(params = {}) {
    const tasks = await this.modelClass
      .query()
      .filter(params)
      .sort(params)
      .paginate(params)
      .withGraphFetched('customer')
      .withGraphFetched('taskUsers.user')
      .withGraphFetched('settings')
      .find();

    return tasks;
  }

  async findOne(id: number) {
    return await this.modelClass
      .query()
      .findById(id)
      .withGraphFetched('customer')
      .withGraphFetched('taskUsers.user')
      .withGraphFetched('creator')
      .withGraphFetched('settings')
      .withGraphFetched('subTasks')
      .withGraphFetched('parentTask')
      .find();
  }

  async count(params = {}) {
    return await this.modelClass
      .query()
      .filter(params)
      .where('deleted_at', null)
      .select('status')
      .count('id as count')
      .groupBy('status');
  }

  async update(user_id: number, id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.modelClass.query().findById(id).withGraphFetched('taskUsers').find();
    await this.updateUsers(task, updateTaskDto);
    delete updateTaskDto.assignee_id;
    delete updateTaskDto.reporter_id;
    if (updateTaskDto.hasOwnProperty('status') || updateTaskDto.hasOwnProperty('running')) {
      if (updateTaskDto.hasOwnProperty('status') && task?.status !== updateTaskDto?.status) {
        const time_log = task?.time_log;
        if (updateTaskDto.status === 'inprogress') {
          // await this.stopAll(user_id, task?.assignee_id, id);
          time_log.push({ action: 'start', created_at: new Date(), created_by: user_id });
          updateTaskDto = {
            ...updateTaskDto,
            running: true,
            time_log: JSON.stringify(time_log),
            completed_at: null,
            completed_by: null,
          };
        } else {
          time_log.push({ action: 'stop', created_at: new Date(), created_by: user_id });
          updateTaskDto = {
            ...updateTaskDto,
            running: false,
            time_log: JSON.stringify(time_log),
            completed_at: null,
            completed_by: null,
          };
          if (updateTaskDto.status === 'done') {
            updateTaskDto = { ...updateTaskDto, completed_at: new Date(), completed_by: user_id };
          }
        }
      } else if (updateTaskDto.hasOwnProperty('running') && task?.running !== updateTaskDto?.running) {
        const time_log = task?.time_log;
        if (updateTaskDto.running) {
          // await this.stopAll(user_id, task?.assignee_id, id);
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

  async updateUsers(task: any, data: any) {
    const currentAssigneeIds = task?.taskUsers
      ?.filter((item: any) => item.type === 'assignee')
      ?.map((item: any) => item.user_id);
    const currentReporterIds = task?.taskUsers
      ?.filter((item: any) => item.type === 'reporter')
      ?.map((item: any) => item.user_id);

    const idsToRemove = [
      ...currentAssigneeIds.filter((id: any) => !data?.assignee_id?.includes(id)),
      ...currentReporterIds.filter((id: any) => !data?.reporter_id?.includes(id)),
    ];

    const newAssigneeIds = data?.assignee_id?.filter((id: any) => !currentAssigneeIds.includes(id));
    const newReporterIds = data?.reporter_id?.filter((id: any) => !currentReporterIds.includes(id));
    const idsToCreate = [
      ...newAssigneeIds?.map((id: any) => ({ user_id: id, type: 'assignee', task_id: task.id })),
      ...newReporterIds?.map((id: any) => ({ user_id: id, type: 'reporter', task_id: task.id })),
    ];

    if (idsToRemove.length > 0) {
      await this.modelClassTaskUser
        .query()
        .where('id', 'in', idsToRemove)
        .patch({ deleted_at: new Date().toISOString().slice(0, 19).replace('T', ' ') });
    }

    if (idsToCreate.length > 0) {
      await this.modelClassTaskUser.query().insert(idsToCreate);
    }
  }

  async stopAll(user_id: number, assignee_id: number, id: number) {
    const tasks = await this.modelClass
      .query()
      .where('running', true)
      .where('assignee_id', assignee_id)
      .where('id', '!=', id)
      .find();
    tasks?.map(async (item: any) => {
      const time_log = item.time_log;
      if (time_log.length > 0 && time_log[time_log.length - 1].action === 'start') {
        time_log.push({ action: 'stop', created_at: new Date(), created_by: user_id });
      }
      await this.modelClass
        .query()
        .findById(item.id)
        .update({ running: false, time_log: JSON.stringify(time_log) });
    });
  }
}
