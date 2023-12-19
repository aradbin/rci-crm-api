import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CreateMessageConversationDto, CreateMessageDto } from './dto/create-message.dto';
import { MessageConversationModel, MessageModel } from './message.models';
import { UpdateMessageConversationDto } from './dto/update-message.dto';
@Injectable()
export class MessageService {
  constructor(
    @Inject('MessageConversationModel') private conversationModelClass: ModelClass<MessageConversationModel>,
    @Inject('MessageModel') private messageModelClass: ModelClass<MessageModel>,
  ) { }

  async create(userId: number, createMessageDto: CreateMessageDto) {
    let conversation = await this.conversationModelClass.query().where('user_id', createMessageDto?.user_id).where('created_by', userId).find().first()

    if (!conversation) {
      const createMessageConversationDto: CreateMessageConversationDto = {
        user_id: createMessageDto.user_id,
        created_at: null,
        created_by: userId
      }
      conversation = await this.conversationModelClass.query().insert(createMessageConversationDto)
    } else {
      const updateMessageConversationDto: UpdateMessageConversationDto = {
        user_id: createMessageDto.user_id
      }
      await this.conversationModelClass.query().where('id', conversation.id).update(updateMessageConversationDto)
    }

    if (!conversation) {
      throw new NotFoundException(`No conversation found`);
    }

    return await this.messageModelClass.query().insert({
      conversation_id: conversation?.id,
      message: createMessageDto.message,
    });
  }

  async findAll(params: any = {}) {
    return await this.conversationModelClass.query().paginate(params).filter(params).withGraphFetched('recipient').find();
  }

  async findOne(id: number, params: any = {}) {
    return await this.messageModelClass.query().where('conversation_id', id).paginate(params).filter(params).find();
  }
}
