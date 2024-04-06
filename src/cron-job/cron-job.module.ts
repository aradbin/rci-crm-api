import { Module } from '@nestjs/common';
import { TaskModule } from 'src/task/task.module';
import { CronJobController } from './cron-job.controller';
import { CronJobService } from './cron-job.service';

@Module({
  imports: [TaskModule],
  controllers: [CronJobController],
  providers: [CronJobService],
  exports: [CronJobService],
})
export class CronJobModule {}
