import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageConversationDto, CreateMessageDto } from './create-message.dto';

export class UpdateMessageConversationDto extends PartialType(CreateMessageConversationDto) { }

export class UpdateMessageDto extends PartialType(CreateMessageDto) { }
