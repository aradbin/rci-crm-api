import { IsArray, IsBoolean, IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide valid email address' })
  email: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  contact: string;

  @IsOptional()
  @IsArray()
  settings_id: number[];

  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  created_at: string;

  @IsOptional()
  @IsInt()
  created_by: number;
}
