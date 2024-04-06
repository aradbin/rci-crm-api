import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CronJobService } from './cron-job.service';
import { CreateCronJobDto } from './dto/create-cron-job.dto';
import { UpdateCronJobDto } from './dto/update-cron-job.dto';

@Controller('cron-jobs')
export class CronJobController {
    constructor(private readonly cronJobService: CronJobService) {}

    @Post()
    async create(@Body() createCronJobDto: CreateCronJobDto) {
        return await this.cronJobService.create(createCronJobDto);
    }

    @Get()
    async findAll(@Query() query) {
        return await this.cronJobService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.cronJobService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateCronJobDto: UpdateCronJobDto) {
        return await this.cronJobService.update(id, updateCronJobDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.cronJobService.remove(id);
    }
}
