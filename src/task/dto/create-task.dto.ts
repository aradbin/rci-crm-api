import {
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
  @IsEnum(Object.values(TaskStatus))
  status: TaskStatus;

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
