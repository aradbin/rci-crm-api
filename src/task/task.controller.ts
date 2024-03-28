import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Request, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('attachments'))
  create(@Body() createTaskDto: CreateTaskDto, @UploadedFiles() attachments: Array<Express.Multer.File>) {
    return this.taskService.create(createTaskDto, attachments);
  }

  @Get()
  findAll(@Query() query) {
    return this.taskService.findAll(query);
  }

  @Get('count')
  count(@Query() query) {
    return this.taskService.count(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(req?.user?.id, id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.remove(id);
  }
}
