import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailSettingDto } from './create-email-setting.dto';

export class UpdateEmailSettingDto extends PartialType(CreateEmailSettingDto) {}
