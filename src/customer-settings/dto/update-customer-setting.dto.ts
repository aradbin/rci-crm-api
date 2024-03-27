import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerSettingDto } from './create-customer-setting.dto';

export class UpdateCustomerSettingDto extends PartialType(CreateCustomerSettingDto) {
    updated_at: string;
    updated_by: number;
    deleted_at: string;
    deleted_by: number;
}
