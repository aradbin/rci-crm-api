import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CronJobService } from './cron-job.service';
import { CreateCronJobDto } from './dto/create-cron-job.dto';
import { UpdateCronJobDto } from './dto/update-cron-job.dto';

@Controller('cron-jobs')
export class CronJobController {
    constructor(private readonly cronJobService: CronJobService) {}

    @Post()
    create(@Body() createCronJobDto: CreateCronJobDto) {
        return this.cronJobService.create(createCronJobDto);
    }

    @Get()
    findAll() {
        return this.cronJobService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.cronJobService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCronJobDto: UpdateCronJobDto) {
        return this.cronJobService.update(+id, updateCronJobDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.cronJobService.remove(+id);
    }
}
