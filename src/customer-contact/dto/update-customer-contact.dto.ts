import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerContactDto } from './create-customer-contact.dto';

export class UpdateCustomerContactDto extends PartialType(CreateCustomerContactDto) {
  updated_at: string;
  updated_by: number;
  deleted_at: string;
  deleted_by: number;
}
