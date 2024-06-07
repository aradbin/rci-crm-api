import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsString()
  optional_contact: string;

  @IsOptional()
  @IsNumber()
  priority: number;

  @IsOptional()
  @IsString()
  avatar: string;
}
