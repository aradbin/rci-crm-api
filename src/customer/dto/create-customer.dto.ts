import { IsBoolean, IsEmail, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide valid email address' })
  email: string;

  @IsOptional()
  @IsString()
  contact: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsNumber()
  priority: number;

  @IsOptional()
  @IsString()
  optional_contact: string;

  @IsOptional()
  @IsString()
  business_type: string;

  @IsOptional()
  @IsString()
  customer_type: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  documents: string;

  @IsOptional()
  @IsObject()
  metadata: any;
}
