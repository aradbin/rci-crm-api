import { IsBoolean, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  name: string;
  @IsString()
  email: string;
  @IsString()
  address: string;
  @IsString()
  country_code: string;
  @IsString()
  contact: string;
  @IsBoolean()
  verified: boolean;
}
