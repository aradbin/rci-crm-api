import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateWhatsappDto {
  @IsOptional()
  @IsNumber()
  conversation_id: number;

  @IsOptional()
  @IsString()
  sender_number: string;

  @IsOptional()
  @IsString()
  recipient_number: string;

  @IsOptional()
  @IsString()
  context_message_id: string | null;

  @IsOptional()
  @IsString()
  msg_body: string | null;

  @IsOptional()
  @IsString()
  template_name: string | null;

  @IsOptional()
  @IsEnum(['text', 'template'])
  message_type: 'text' | 'template' = 'text';

  @IsOptional()
  @IsString()
  created_at: string;

  @IsOptional()
  @IsInt()
  created_by: number;
}

export class CreateWhatsappConversationDto {
  @IsOptional()
  @IsString()
  sender_number: string;

  @IsOptional()
  @IsString()
  recipient_number: string;

  @IsOptional()
  @IsString()
  created_at: string;

  @IsOptional()
  @IsInt()
  created_by: number;
}

export class UpdateWhatsappConversationDto extends PartialType(CreateWhatsappConversationDto) {
  updated_at: string;
  updated_by: number;
  deleted_at: string;
  deleted_by: number;
}
