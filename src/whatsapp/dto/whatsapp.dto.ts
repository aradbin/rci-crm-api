import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class SendTextMessageDto {
  @IsString()
  sender_number: string;

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
}

export class CreateWhatsappConversationDto {
  @IsNumber()
  customer_id: number;

  @IsNumber()
  whatsapp_business_number_id: number;
}

export class UpdateWhatsappConversationDto extends PartialType(CreateWhatsappConversationDto) { }
