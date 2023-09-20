import { PartialType } from '@nestjs/mapped-types';
import { CreateUserEmailDto } from './create-user-email.dto';

export class UpdateUserEmailDto extends PartialType(CreateUserEmailDto) {
    updated_at: string;
    updated_by: number;
    deleted_at: string;
    deleted_by: number;
}
