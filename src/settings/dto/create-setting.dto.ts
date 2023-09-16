import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSettingDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString()
    name: string;
    
    @IsNotEmpty({ message: 'Type is required' })
    @IsString()
    type: string;

    @IsNotEmpty({ message: 'Parent is required' })
    @IsInt()
    parent_id: number;

    @IsOptional()
    @IsString()
    created_at: string;

    @IsOptional()
    @IsInt()
    created_by: number;
}