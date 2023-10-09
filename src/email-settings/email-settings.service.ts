import { Inject, Injectable } from '@nestjs/common';
import { CreateEmailSettingDto } from './dto/create-email-setting.dto';
import { UpdateEmailSettingDto } from './dto/update-email-setting.dto';
import { ModelClass } from 'objection';
import { EmailSettingsModel } from './email-settings.model';
import * as crypto from 'crypto';

@Injectable()
export class EmailSettingsService {
  constructor(
    @Inject('EmailSettingsModel') private modelClass: ModelClass<EmailSettingsModel>
  ) { }

  async create(createEmailSettingDto: CreateEmailSettingDto) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32); // 256-bit key
    const iv = crypto.randomBytes(16); // 128-bit IV

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedData = cipher.update(createEmailSettingDto.password, 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    createEmailSettingDto.password = key.toString('hex') + iv.toString('hex') + encryptedData;

    return await this.modelClass.query().insert(createEmailSettingDto);

    // const keyForDecryption = Buffer.from(encryptedDataWithKeyIV.slice(0, 64), 'hex');
    // const ivForDecryption = Buffer.from(encryptedDataWithKeyIV.slice(64, 96), 'hex');
    // const encryptedDataForDecryption = encryptedDataWithKeyIV.slice(96);

    // const decipher = crypto.createDecipheriv(algorithm, keyForDecryption, ivForDecryption);
    // let decryptedData = decipher.update(encryptedDataForDecryption, 'hex', 'utf8');
    // decryptedData += decipher.final('utf8');
    // console.log('Decrypted Data:', decryptedData);
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
