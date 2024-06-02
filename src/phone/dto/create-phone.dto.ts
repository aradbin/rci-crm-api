import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePhoneDto {
  @IsOptional()
  @IsNumber()
  settings_id: number;

  @IsOptional()
  @IsNumber()
  customer_id: number;

  @IsOptional()
  @IsString()
  number: string;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  log: string;

  @IsOptional()
  @IsString()
  note: string;
}
