import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ModelClass } from 'objection';
import {
  CreateWhatsappBusinessNumberDto,
  CreateWhatsappConversationDto,
  CreateWhatsappUserDto,
  UpdateWhatsappBusinessNumberDto,
  UpdateWhatsappConversationDto,
  UpdateWhatsappUserDto,
} from './dto/whatsapp.dto';
import { WhatsappBusinessNumberModel, WhatsappConversationModel, WhatsappUserModel } from './whatsapp.models';

@Injectable()
export class WhatsappBusinessNumberService {
  constructor(@Inject('WhatsappBusinessNumberModel') private modelClass: ModelClass<WhatsappBusinessNumberModel>) {}

  async create(createWhatsappBusinessNumberDto: CreateWhatsappBusinessNumberDto) {
    return await this.modelClass.query().insert(createWhatsappBusinessNumberDto);
  }

  async findAll(params: any = {}) {
    return await this.modelClass.query().filter(params).sort(params).paginate(params).find();
  }

  async findOne(id: number) {
    var whatsappBusinessNumber = await this.modelClass.query().findById(id).find();
    if (whatsappBusinessNumber) {
      return whatsappBusinessNumber;
    }
    throw new NotFoundException('Whatsapp Business Number not found');
  }

  async update(id: number, updateWhatsappBusinessNumbersDto: UpdateWhatsappBusinessNumberDto) {
    var updateCount = await this.modelClass.query().findById(id).update(updateWhatsappBusinessNumbersDto);
    if (updateCount > 0) {
      return await this.modelClass.query().findById(id).find();
    }
    throw new NotFoundException('Whatsapp Business Number not found');
  }

  async remove(id: number) {
    var deleteCount = await this.modelClass.query().softDelete(id);
    if (deleteCount > 0) {
      return { message: 'WhatsappBusinessNumber deleted successfully' };
    }
    throw new NotFoundException('Whatsapp Business Number not found');
  }
}

@Injectable()
export class WhatsappUserService {
  constructor(@Inject('WhatsappUserModel') private modelClass: ModelClass<WhatsappUserModel>) {}

  async getOrCreate(createWhatsappUserDto: CreateWhatsappUserDto) {
    var user = await this.modelClass.query().findOne(createWhatsappUserDto).find();
    if (user) {
      return user;
    }
    return await this.modelClass.query().insert(createWhatsappUserDto);
  }

  async findAll(params: any = {}) {
    return await this.modelClass
      .query()
      .filter(params)
      .sort(params)
      .paginate(params)
      .withGraphFetched('user')
      .withGraphFetched('whatsapp_business_number')
      .find();
  }

  async findOne(id: number) {
    var user = await this.modelClass.query().findById(id).withGraphFetched('user').withGraphFetched('whatsapp_business_number').find();
    if (user) {
      return user;
    }
    throw new NotFoundException('Whatsapp User not found');
  }

  async update(id: number, updateWhatsappUserDto: UpdateWhatsappUserDto) {
    var updateCount = await this.modelClass.query().findById(id).update(updateWhatsappUserDto);
    if (updateCount > 0) {
      return await this.modelClass.query().findById(id).find();
    }
    throw new NotFoundException('Whatsapp User not found');
  }

  async remove(id: number) {
    var deleteCount = await this.modelClass.query().softDelete(id);
    if (deleteCount > 0) {
      return { message: 'Whatsapp User deleted successfully' };
    }
    throw new NotFoundException('Whatsapp User not found');
  }
}

@Injectable()
export class WhatsappConversationService {
  constructor(@Inject('WhatsappConversationModel') private modelClass: ModelClass<WhatsappConversationModel>) {}

  async getOrCreate(createWhatsappConvDto: CreateWhatsappConversationDto) {
    var conversation = await this.modelClass.query().findOne(createWhatsappConvDto).find();
    if (conversation) {
      return conversation;
    }
    return await this.modelClass.query().insert(createWhatsappConvDto);
  }

  async findAll(params: any = {}) {
    return await this.modelClass
      .query()
      .filter(params)
      .sort(params)
      .paginate(params)
      .withGraphFetched('customer')
      .withGraphFetched('whatsapp_business_number')
      .find();
  }

  async findOne(id: number) {
    var user = await this.modelClass.query().findById(id).withGraphFetched('customer').withGraphFetched('whatsapp_business_number').find();
    if (user) {
      return user;
    }
    throw new NotFoundException('Whatsapp Conversation not found');
  }

  async update(id: number, updateWhatsappConvDto: UpdateWhatsappConversationDto) {
    var updateCount = await this.modelClass.query().findById(id).update(updateWhatsappConvDto);
    if (updateCount > 0) {
      return await this.modelClass.query().findById(id).find();
    }
    throw new NotFoundException('Whatsapp Conversation not found');
  }

  async remove(id: number) {
    var deleteCount = await this.modelClass.query().softDelete(id);
    if (deleteCount > 0) {
      return { message: 'Whatsapp Conversation deleted successfully' };
    }
    throw new NotFoundException('Whatsapp Conversation not found');
  }
}
