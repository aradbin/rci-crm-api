import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @IsEmail({}, { message: 'Please provide valid email address' })
  email: string;

  @IsOptional()
  @IsString()
  contact: string;

  @IsOptional()
  @IsString()
  address: string;
}
