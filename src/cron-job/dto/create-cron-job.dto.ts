import { IsBoolean, IsDateString, IsInt, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCronJobDto {
    @IsOptional()
    @IsString()
    type: string;

    @IsOptional()
    @IsNumber()
    type_id: number;

    @IsOptional()
    @IsDateString()
    next_run_time: Date;

    @IsOptional()
    @IsObject()
    metadata: any;

    @IsOptional()
    @IsBoolean()
    is_active: boolean;

    @IsOptional()
    @IsString()
    created_at: string;

    @IsOptional()
    @IsInt()
    created_by: number;
}
