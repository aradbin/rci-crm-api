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

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    return await this.modelClass.query().findById(id).update(updateTaskDto);
  }

  async remove(id: number) {
    return await this.modelClass.query().softDelete(id);
  }
}
