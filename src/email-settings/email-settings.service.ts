import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateEmailSettingDto } from './dto/create-email-setting.dto';
import { UpdateEmailSettingDto } from './dto/update-email-setting.dto';
import { ModelClass } from 'objection';
import { EmailSettingsModel } from './email-settings.model';
import * as crypto from 'crypto';

@Injectable()
export class EmailSettingsService {
  constructor(@Inject('EmailSettingsModel') private modelClass: ModelClass<EmailSettingsModel>) { }

  async create(createEmailSettingDto: CreateEmailSettingDto) {

    createEmailSettingDto.password = this.encryptPassword(createEmailSettingDto?.password);

    return await this.modelClass.query().insert(createEmailSettingDto);
  }

  // findAll() {
  //   return `This action returns all emailSettings`;
  // }

  async findOne(id: number) {
    return await this.modelClass.query().findById(id).first().find();
  }

  async findByUserId(userId: number) {
    return await this.modelClass.query().where("user_id", userId).first().find();
  }

  async update(id: number, updateEmailSettingDto: UpdateEmailSettingDto) {
    const emailSettings = await this.findOne(id);
    if (!emailSettings) {
      throw new NotAcceptableException("Email config not found. Please config your email");
    }
    if (updateEmailSettingDto?.password !== emailSettings?.password) {
      updateEmailSettingDto.password = this.encryptPassword(updateEmailSettingDto?.password)
    }

    return await this.modelClass.query().findById(id).update(updateEmailSettingDto);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} emailSetting`;
  // }

  encryptPassword(str: string) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32); // 256-bit key
    const iv = crypto.randomBytes(16); // 128-bit IV

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedData = cipher.update(str, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    const password = key.toString('hex') + iv.toString('hex') + encryptedData

    return password;
  }

  decryptPassword(str: string) {
    const algorithm = 'aes-256-cbc';
    const keyForDecryption = Buffer.from(str.slice(0, 64), 'hex');
    const ivForDecryption = Buffer.from(str.slice(64, 96), 'hex');
    const encryptedDataForDecryption = str.slice(96);

    const decipher = crypto.createDecipheriv(algorithm, keyForDecryption, ivForDecryption);
    let decryptedData = decipher.update(encryptedDataForDecryption, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');

    return decryptedData;
  }
}
