import { IsEnum, IsOptional, IsString } from 'class-validator';
import { type } from 'os';

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
