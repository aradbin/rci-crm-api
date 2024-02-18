import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @IsOptional()
    @IsDateString()
    completed_at: Date;

    @IsOptional()
    @IsNumber()
    completed_by: number;
}
