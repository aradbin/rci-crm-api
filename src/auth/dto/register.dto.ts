import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsEmail({}, { message: 'Please provide valid email address'})
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsOptional()
    @IsString()
    username: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @IsOptional()
    @IsString()
    contact: string;

    @IsOptional()
    @IsString()
    created_at: string;

    @IsOptional()
    @IsInt()
    created_by: number;
}
