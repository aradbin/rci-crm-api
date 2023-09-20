import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserEmailDto {
    @IsNotEmpty({ message: 'Host is required' })
    @IsString()
    host: string;

    @IsNotEmpty({ message: 'Username is required' })
    @IsString()
    username: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    created_at: string;

    @IsOptional()
    @IsInt()
    created_by: number;
}
