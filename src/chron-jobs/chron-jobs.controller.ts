import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ChronJobsService } from './chron-jobs.service';
import { CreateChronJobDto } from './dto/create-chron-job.dto';
import { UpdateChronJobDto } from './dto/update-chron-job.dto';

@Controller('chron-jobs')
export class ChronJobsController {
    constructor(private readonly chronJobsService: ChronJobsService) {}

    @Post()
    create(@Body() createChronJobDto: CreateChronJobDto) {
        return this.chronJobsService.create(createChronJobDto);
    }

    @Get()
    findAll() {
        return this.chronJobsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.chronJobsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateChronJobDto: UpdateChronJobDto) {
        return this.chronJobsService.update(+id, updateChronJobDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.chronJobsService.remove(+id);
    }
}
