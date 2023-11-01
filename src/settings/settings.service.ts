import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsModel } from './settings.model';
import * as crypto from 'crypto';

@Injectable()
export class SettingsService {
  constructor(
    @Inject('SettingsModel') private modelClass: ModelClass<SettingsModel>
  ) { }

  async create(createSettingDto: CreateSettingDto) {
    if (createSettingDto.type === 'email') {
      createSettingDto.metadata.password = this.encryptPassword(createSettingDto.metadata.password);
    }

    return await this.modelClass.query().insert(createSettingDto);
  }

  async findAll(params: any = {}) {
    return await this.modelClass.query().paginate(params).filter(params).withGraphFetched('parent').withGraphFetched('children').find()
  }

  async findOne(id: number) {
    return await this.modelClass.query().findById(id).withGraphFetched('parent').withGraphFetched('children').find()
  }

  async update(id: number, updateSettingDto: UpdateSettingDto) {
    if (updateSettingDto.type === 'email') {
      const emailSettings = await this.findOne(id);
      if (!emailSettings) {
        throw new NotAcceptableException("Email settings not found");
      }
      if (updateSettingDto?.metadata?.password !== emailSettings?.metadata?.password) {
        updateSettingDto.metadata.password = this.encryptPassword(updateSettingDto.metadata.password)
      }
    }

    return await this.modelClass.query().findById(id).update(updateSettingDto)
  }

  async remove(id: number) {
    return await this.modelClass.query().softDelete(id)
  }

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
}
