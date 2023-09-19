import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserSettingsDto {
    @IsNotEmpty({ message: 'User is required' })
    @IsInt()
    user_id: number;

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
