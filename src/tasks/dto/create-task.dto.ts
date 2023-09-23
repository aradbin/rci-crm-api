import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { TaskProgressStatus, TaskStatus } from 'src/database/enums/tasks';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  priority: number;

  @IsOptional()
  @IsEnum(Object.values(TaskStatus))
  status: TaskStatus;

  @IsOptional()
  @IsEnum(Object.values(TaskProgressStatus))
  progress_status: TaskProgressStatus;

  @IsOptional()
  @IsObject()
  metadata: any;

  @IsOptional()
  @IsObject()
  attachments: any;

  @IsOptional()
  @IsDateString()
  due_date: Date;

  @IsOptional()
  @IsNumber()
  customer_id: number;

  @IsOptional()
  @IsNumber()
  assignee_id: number;
}

// "due_date": "",
// "status": "",
// "progress_status": "",
