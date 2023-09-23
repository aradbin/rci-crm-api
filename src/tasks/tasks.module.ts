import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskModel } from './tasks.model';

@Module({
  controllers: [TasksController],
  providers: [TasksService, { provide: 'TaskModel', useValue: TaskModel }],
})
export class TasksModule {}
