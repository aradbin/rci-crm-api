import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class SendTextMessageDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  conversation_id: number;

  @IsString()
  customer_number: string;

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

export class CreateWhatsappBusinessNumberDto {
  @IsString()
  name: string;

  @IsString()
  phone_number: string;

  @IsString()
  phone_number_id: string;

  @IsString()
  access_token: string;

  @IsString()
  whatsapp_business_account_id: string;
}

export class UpdateWhatsappBusinessNumberDto extends PartialType(CreateWhatsappBusinessNumberDto) {}

export class CreateWhatsappUserDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  whatsapp_business_number_id: number;
}

export class UpdateWhatsappUserDto extends PartialType(CreateWhatsappUserDto) {}

export class CreateWhatsappConversationDto {
  @IsNumber()
  customer_id: number;

  @IsNumber()
  whatsapp_business_number_id: number;
}

export class UpdateWhatsappConversationDto extends PartialType(CreateWhatsappConversationDto) {}
