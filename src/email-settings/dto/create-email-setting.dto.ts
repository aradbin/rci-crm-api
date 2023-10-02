import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateEmailSettingDto {
    @IsNotEmpty({ message: 'Host is required' })
    host: string;

    @IsNotEmpty({ message: 'Email address is required' })
    username: string;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @IsNotEmpty({ message: 'User is required' })
    @IsInt()
    user_id: number;

    @IsOptional()
    @IsString()
    created_at: string;

    @IsOptional()
    @IsInt()
    created_by: number;
}
