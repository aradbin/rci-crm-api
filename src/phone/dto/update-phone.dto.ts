import { PartialType } from '@nestjs/mapped-types';
import { CreatePhoneDto } from './create-phone.dto';

export class UpdatePhoneDto extends PartialType(CreatePhoneDto) {
  updated_at: string;
  updated_by: number;
  deleted_at: string;
  deleted_by: number;
}
