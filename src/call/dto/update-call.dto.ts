import { PartialType } from '@nestjs/mapped-types';
import { CreateCallDto } from './create-call.dto';

export class UpdateCallDto extends PartialType(CreateCallDto) {
  updated_at: string;
  updated_by: number;
  deleted_at: string;
  deleted_by: number;
}
