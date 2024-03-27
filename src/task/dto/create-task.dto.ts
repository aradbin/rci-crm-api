import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { TaskStatus } from 'src/database/enums/tasks';

export class CreateTaskDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  priority: number;

  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsObject()
  attachments: any;

  @IsOptional()
  @IsDateString()
  due_date: Date;

  @IsOptional()
  @IsString()
  estimation: string;

  @IsOptional()
  time_log: any;

  @IsOptional()
  @IsBoolean()
  running: boolean;

  @IsOptional()
  @IsNumber()
  parent_id: number;

  @IsOptional()
  @IsNumber()
  customer_id: number;

  @IsOptional()
  @IsNumber()
  assignee_id: number;

  @IsOptional()
  @IsNumber()
  reporter_id: number;

  @IsOptional()
  @IsNumber()
  type_id: number;
}
