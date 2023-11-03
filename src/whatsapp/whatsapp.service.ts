import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ModelClass } from 'objection';
import {
  CreateWhatsappConversationDto,
  UpdateWhatsappConversationDto,
} from './dto/whatsapp.dto';

// @Injectable()
// export class WhatsappConversationService {
//   constructor(@Inject('WhatsappConversationModel') private modelClass: ModelClass<WhatsappConversationModel>) {}

//   async getOrCreate(createWhatsappConvDto: CreateWhatsappConversationDto) {
//     var conversation = await this.modelClass.query().findOne(createWhatsappConvDto).find();
//     if (conversation) {
//       return conversation;
//     }
//     return await this.modelClass.query().insert(createWhatsappConvDto);
//   }

//   async findAll(params: any = {}) {
//     return await this.modelClass
//       .query()
//       .filter(params)
//       .sort(params)
//       .paginate(params)
//       .withGraphFetched('customer')
//       .withGraphFetched('whatsapp_business_number')
//       .find();
//   }

//   async findOne(id: number) {
//     var user = await this.modelClass.query().findById(id).withGraphFetched('customer').withGraphFetched('whatsapp_business_number').find();
//     if (user) {
//       return user;
//     }
//     throw new NotFoundException('Whatsapp Conversation not found');
//   }

//   async update(id: number, updateWhatsappConvDto: UpdateWhatsappConversationDto) {
//     var updateCount = await this.modelClass.query().findById(id).update(updateWhatsappConvDto);
//     if (updateCount > 0) {
//       return await this.modelClass.query().findById(id).find();
//     }
//     throw new NotFoundException('Whatsapp Conversation not found');
//   }

//   async remove(id: number) {
//     var deleteCount = await this.modelClass.query().softDelete(id);
//     if (deleteCount > 0) {
//       return { message: 'Whatsapp Conversation deleted successfully' };
//     }
//     throw new NotFoundException('Whatsapp Conversation not found');
//   }
// }
