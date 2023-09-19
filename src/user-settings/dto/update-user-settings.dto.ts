import { PartialType } from '@nestjs/mapped-types';
import { CreateUserSettingsDto } from './create-user-settings.dto';

export class UpdateUserSettingsDto extends PartialType(CreateUserSettingsDto) {
    updated_at: string;
    updated_by: number;
    deleted_at: string;
    deleted_by: number;
}
