import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class SendTextMessageDto {
  @IsString()
  to: string;

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

export class CreateWhatsappSettingDto {
  @IsString()
  name: string;

  @IsString()
  phone_number: string;

  @IsString()
  phone_number_id: string;

  @IsString()
  access_token: string;
}

export class UpdateWhatsappSettingDto extends PartialType(CreateWhatsappSettingDto) {}

export class CreateWhatsappUserDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  whatsapp_setting_id: number;
}

export class UpdateWhatsappUserDto extends PartialType(CreateWhatsappUserDto) {}
