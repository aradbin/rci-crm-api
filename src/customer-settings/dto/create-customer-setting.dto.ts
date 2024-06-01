import { IsBoolean, IsInt, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCustomerSettingDto {
    @IsNotEmpty({ message: 'Customer is required' })
    @IsInt()
    customer_id: number;

    @IsNotEmpty({ message: 'Settings is required' })
    @IsInt()
    settings_id: number;

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
