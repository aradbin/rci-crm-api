import { Inject, Injectable } from '@nestjs/common';
import { CreateEmailSettingDto } from './dto/create-email-setting.dto';
import { UpdateEmailSettingDto } from './dto/update-email-setting.dto';
import { ModelClass } from 'objection';
import { EmailSettingsModel } from './email-settings.model';

@Injectable()
export class EmailSettingsService {
  constructor(
    @Inject('EmailSettingsModel') private modelClass: ModelClass<EmailSettingsModel>
  ) {}

  async create(createEmailSettingDto: CreateEmailSettingDto) {
    return await this.modelClass.query().insert(createEmailSettingDto);
  }

  // findAll() {
  //   return `This action returns all emailSettings`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} emailSetting`;
  // }

  // update(id: number, updateEmailSettingDto: UpdateEmailSettingDto) {
  //   return `This action updates a #${id} emailSetting`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} emailSetting`;
  // }
}
