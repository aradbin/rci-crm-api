import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
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
    findAll(@Query() query) {
        return this.cronJobService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.cronJobService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateCronJobDto: UpdateCronJobDto) {
        return this.cronJobService.update(id, updateCronJobDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.cronJobService.remove(id);
    }
}
