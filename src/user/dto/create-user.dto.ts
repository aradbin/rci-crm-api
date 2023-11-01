import { IsArray, IsEmail, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsString()
  created_at: string;

  @IsOptional()
  @IsInt()
  created_by: number;
}

export class SendMessageDto {
  @IsNumber()
  recipient_id: number;

  @IsString()
  message_body: string;

  @IsString()
  message_type: string;

  @IsOptional()
  @IsString()
  context_message_id: string;
}
