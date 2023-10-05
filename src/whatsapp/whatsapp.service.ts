import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CreateWhatsappSettingDto, CreateWhatsappUserDto, UpdateWhatsappSettingDto, UpdateWhatsappUserDto } from './dto/whatsapp.dto';
import { WhatsappSettingModel, WhatsappUserModel } from './whatsapp.models';

@Injectable()
export class WhatsappSettingService {
  constructor(@Inject('WhatsappSettingModel') private modelClass: ModelClass<WhatsappSettingModel>) {}

  async create(createWhatsappSettingsDto: CreateWhatsappSettingDto) {
    return await this.modelClass.query().insert(createWhatsappSettingsDto);
  }

  async findAll(params: any = {}) {
    return await this.modelClass.query().filter(params).sort(params).paginate(params).find();
  }

  async findOne(id: number) {
    var setting = await this.modelClass.query().findById(id).find();
    if (setting) {
      return setting;
    }
    throw new NotFoundException('Setting not found');
  }

  async update(id: number, updateWhatsappSettingsDto: UpdateWhatsappSettingDto) {
    var updateCount = await this.modelClass.query().findById(id).update(updateWhatsappSettingsDto);
    if (updateCount > 0) {
      return await this.modelClass.query().findById(id).find();
    }
    throw new NotFoundException('Setting not found');
  }

  async remove(id: number) {
    var deleteCount = await this.modelClass.query().softDelete(id);
    if (deleteCount > 0) {
      return { message: 'Setting deleted successfully' };
    }
    throw new NotFoundException('Setting not found');
  }
}

@Injectable()
export class WhatsappUserService {
  constructor(@Inject('WhatsappUserModel') private modelClass: ModelClass<WhatsappUserModel>) {}

  async create(createWhatsappUserDto: CreateWhatsappUserDto) {
    return await this.modelClass.query().insert(createWhatsappUserDto);
  }

  async findAll(params: any = {}) {
    return await this.modelClass
      .query()
      .filter(params)
      .sort(params)
      .paginate(params)
      .withGraphFetched('user')
      .withGraphFetched('whatsapp_setting')
      .find();
  }

  
  async findOne(id: number) {
    var user = await this.modelClass.query().findById(id).withGraphFetched('user').withGraphFetched('whatsapp_setting').find();
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
