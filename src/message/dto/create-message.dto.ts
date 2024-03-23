import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMessageConversationDto {
  @IsOptional()
  @IsNumber()
  user_one: number;

  @IsOptional()
  @IsNumber()
  user_two: number;

  @IsOptional()
  @IsString()
  created_at: string;

  @IsOptional()
  @IsNumber()
  created_by: number;
}

export class CreateMessageDto {
  @IsOptional()
  @IsNumber()
  conversation_id: number;

  @IsOptional()
  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsString()
  message: string | null;

  @IsOptional()
  @IsString()
  status: string | null;

  @IsOptional()
  @IsString()
  created_at: string;

  @IsOptional()
  @IsNumber()
  created_by: number;
}
