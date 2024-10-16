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
    const { filterParams, queryBuilder } = this.filter(params, query);

    return await queryBuilder
      .filter(filterParams)
      .sort(filterParams)
      .paginate(filterParams)
      .withGraphFetched('customer')
      .withGraphFetched('taskUsers.user')
      .select('tasks.*')
      .find();
  }

  async findOne(id: number) {
    return await this.modelClass
      .query()
      .findById(id)
      .withGraphFetched('customer')
      .withGraphFetched('taskUsers.user')
      .withGraphFetched('creator')
      .withGraphFetched('settings')
      .withGraphFetched('subTasks.taskUsers.user')
      .withGraphFetched('parentTask')
      .find();
  }

  async count(params: any = {}) {
    const tasks = await this.findAll(params);
    const count = {
      todo: 0,
      inprogress: 0,
      inreview: 0,
      done: 0,
    };
    tasks.forEach((task: any) => {
      count[task.status]++;
    });

    return [
      { status: 'todo', count: count.todo },
      { status: 'inprogress', count: count.inprogress },
      { status: 'inreview', count: count.inreview },
      { status: 'done', count: count.done },
    ];

    const query = this.modelClass.query();
    const { filterParams, queryBuilder } = this.filter(params, query);

    return await queryBuilder
      .filter(filterParams)
      .where('tasks.deleted_at', null)
      .count('tasks.id as count')
      .groupBy('tasks.status');
  }

  async update(user_id: number, id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.modelClass.query().findById(id).withGraphFetched('taskUsers').find();

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

  filter(filterParams: any, queryBuilder: any) {
    if (filterParams.hasOwnProperty('user_id')) {
      queryBuilder
        .leftJoin('task_users', 'tasks.id', '=', 'task_users.task_id')
        .where('task_users.user_id', filterParams.user_id)
        .distinct('tasks.id');

      delete filterParams.user_id;
    }

    return { filterParams, queryBuilder };
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
      await this.modelClassTaskUser.query().where('id', 'in', idsToRemove).del();
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
