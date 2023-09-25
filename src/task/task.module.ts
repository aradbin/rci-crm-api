import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskModel } from './task.model';
import { TaskService } from './task.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, { provide: 'TaskModel', useValue: TaskModel }],
})
export class TaskModule {}
