import { PartialType } from '@nestjs/mapped-types';
import { CreateVoipDto } from './create-voip.dto';

export class UpdateVoipDto extends PartialType(CreateVoipDto) {
    updated_at: string;
    updated_by: number;
    deleted_at: string;
    deleted_by: number;
}
