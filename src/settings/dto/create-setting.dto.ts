import { IsInt, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class CreateSettingDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString()
    name: string;

    @IsNotEmpty({ message: 'Type is required' })
    @IsString()
    type: string;

    @IsOptional()
    @IsObject()
    metadata: any;

    @IsOptional()
    @IsInt()
    parent_id: number;

    @IsOptional()
    @IsString()
    created_at: string;

    @IsOptional()
    @IsInt()
    created_by: number;
}