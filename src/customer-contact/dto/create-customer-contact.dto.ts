import { IsInt, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCustomerContactDto {
  @IsNotEmpty({ message: 'Customer is required' })
  @IsInt()
  customer_id: number;

  @IsNotEmpty({ message: 'Contact is required' })
  @IsInt()
  contact_id: number;

  @IsOptional()
  @IsObject()
  metadata: any;

  @IsOptional()
  @IsString()
  created_at: string;

  @IsOptional()
  @IsInt()
  created_by: number;
}
