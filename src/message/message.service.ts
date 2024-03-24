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
    let conversation = await this.conversationModelClass.query()
      .whereIn('user_one', [userId, createMessageDto?.user_id])
      .whereIn('user_two', [userId, createMessageDto?.user_id])
      .find()
      .first();

    if (!conversation) {
      const createMessageConversationDto: CreateMessageConversationDto = {
        user_one: userId,
        user_two: createMessageDto.user_id,
        created_at: null,
        created_by: userId
      }
      conversation = await this.conversationModelClass.query().insert(createMessageConversationDto)
    } else {
      const updateMessageConversationDto: UpdateMessageConversationDto = {
        user_one: conversation.user_one,
        user_two: conversation.user_two,
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

  async findAll(userId: number, params: any = {}) {
    return await this.conversationModelClass.query()
      .where(whereQuery => whereQuery.where('user_one', userId).orWhere('user_two', userId))
      .paginate(params)
      .filter(params)
      .withGraphFetched('userOne')
      .withGraphFetched('userTwo')
      .orderBy('updated_at', 'desc')
      .where('deleted_at', null);
  }

  async findOne(id: number, params: any = {}) {
    return await this.messageModelClass.query().where('conversation_id', id).paginate(params).filter(params).where('deleted_at', null).orderBy('created_at', 'desc');
  }
}
