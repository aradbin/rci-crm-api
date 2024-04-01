import { Module } from '@nestjs/common';
import { ChronJobsService } from './chron-jobs.service';
import { ChronJobsController } from './chron-jobs.controller';

@Module({
  controllers: [ChronJobsController],
  providers: [ChronJobsService],
})
export class ChronJobsModule {}
