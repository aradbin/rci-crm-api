import { PartialType } from '@nestjs/mapped-types';
import { CreateVoipDto } from './create-voip.dto';

export class UpdateVoipDto extends PartialType(CreateVoipDto) {}
