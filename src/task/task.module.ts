import { Module } from '@nestjs/common';
import { MinioService } from 'src/minio/minio.service';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, MinioService],
})
export class TaskModule { }
