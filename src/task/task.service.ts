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

  async findAll(params: any = {}) {
    const query = this.modelClass.query();

    if (params.hasOwnProperty('assignee_id')) {
      query.leftJoin('task_users', 'tasks.id', 'task_users.task_id').where('task_users.user_id', params.assignee_id);
      delete params.assignee_id;
    }

    const tasks = await query
      .filter(params)
      .sort(params)
      .paginate(params)
      .withGraphFetched('customer')
      .withGraphFetched('taskUsers.user')
      .modifyGraph('taskUsers', (qb) => qb.where('deleted_at', null))
      .withGraphFetched('settings')
      .where('tasks.deleted_at', null);

    return tasks;
  }

  async findOne(id: number) {
    return await this.modelClass
      .query()
      .findById(id)
      .withGraphFetched('customer')
      .withGraphFetched('taskUsers.user')
      .modifyGraph('taskUsers', (qb) => qb.where('deleted_at', null))
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
    const task = await this.modelClass
      .query()
      .findById(id)
      .withGraphFetched('taskUsers')
      .modifyGraph('taskUsers', (qb) => qb.where('deleted_at', null))
      .find();

    if (updateTaskDto.hasOwnProperty('assignee_id') || updateTaskDto.hasOwnProperty('reporter_id')) {
      await this.updateUsers(task, updateTaskDto);
      delete updateTaskDto.assignee_id;
      delete updateTaskDto.reporter_id;
    }

    if (updateTaskDto.hasOwnProperty('status') || updateTaskDto.hasOwnProperty('running')) {
      updateTaskDto = await this.updateTimeLog(task, updateTaskDto, user_id);
    }

    return await this.modelClass.query().findById(id).update(updateTaskDto);
  }

  async remove(id: number) {
    return await this.modelClass.query().softDelete(id);
  }

  async updateUsers(task: any, dto: any) {
    const currentAssigneeIds = task?.taskUsers?.filter((item: any) => item.type === 'assignee');
    const currentReporterIds = task?.taskUsers?.filter((item: any) => item.type === 'reporter');

    const idsToRemove = [
      ...currentAssigneeIds
        .filter((item: any) => !dto?.assignee_id?.includes(item.user_id))
        .map((item: any) => item.id),
      ...currentReporterIds
        .filter((item: any) => !dto?.reporter_id?.includes(item.user_id))
        .map((item: any) => item.id),
    ];

    const newAssigneeIds = dto?.assignee_id?.filter(
      (id: any) => !currentAssigneeIds.map((item: any) => item.user_id).includes(id),
    );
    const newReporterIds = dto?.reporter_id?.filter(
      (id: any) => !currentReporterIds.map((item: any) => item.user_id).includes(id),
    );
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

  async updateTimeLog(task: any, dto: any, user_id: number) {
    const time_log = task?.time_log;

    if (dto.hasOwnProperty('status') && task?.status !== dto?.status) {
      if (dto.status === 'inprogress') {
        time_log.push({ action: 'start', created_at: new Date(), created_by: user_id });
        dto = {
          ...dto,
          running: true,
          time_log: JSON.stringify(time_log),
          completed_at: null,
          completed_by: null,
        };
      } else {
        time_log.push({ action: 'stop', created_at: new Date(), created_by: user_id });
        dto = {
          ...dto,
          running: false,
          time_log: JSON.stringify(time_log),
          completed_at: null,
          completed_by: null,
        };
        if (dto.status === 'done') {
          dto = { ...dto, completed_at: new Date(), completed_by: user_id };
        }
      }
    } else if (dto.hasOwnProperty('running') && task?.running !== dto?.running) {
      if (dto.running) {
        time_log.push({ action: 'start', created_at: new Date(), created_by: user_id });
        dto = { ...dto, running: true, time_log: JSON.stringify(time_log) };
      } else {
        time_log.push({ action: 'stop', created_at: new Date(), created_by: user_id });
        dto = { ...dto, running: false, time_log: JSON.stringify(time_log) };
      }
    }

    return dto;
  }
}
