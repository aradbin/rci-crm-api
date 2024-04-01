import { IsBoolean, IsDateString, IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { RepeatIntervalType } from 'src/database/enums/tasks';

export class CreateCronJobDto {
    @IsOptional()
    @IsString()
    type: string;

    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsObject()
    meta_data: any;

    @IsOptional()
    @IsDateString()
    start_date: Date;

    @IsOptional()
    @IsDateString()
    end_date: Date;

    @IsOptional()
    @IsBoolean()
    is_active: boolean;

    @IsOptional()
    @IsNumber()
    repeat_amount: number;

    @IsOptional()
    @IsEnum(RepeatIntervalType)
    repeat_interval: RepeatIntervalType;
}
