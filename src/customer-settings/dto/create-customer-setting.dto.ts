import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerSettingDto {
    @IsNotEmpty({ message: 'Customer is required' })
    @IsInt()
    customer_id: number;

    @IsNotEmpty({ message: 'Settings is required' })
    @IsInt()
    settings_id: number;

    @IsOptional()
    @IsString()
    created_at: string;

    @IsOptional()
    @IsInt()
    created_by: number;
}
