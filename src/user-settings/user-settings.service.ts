import { Inject, Injectable } from '@nestjs/common';
import { CreateUserSettingsDto } from './dto/create-user-settings.dto';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { ModelClass } from 'objection';
import { UserSettingsModel } from './user-settings.model';
import * as crypto from 'crypto';

@Injectable()
export class UserSettingsService {
  constructor(
    @Inject('UserSettingsModel') private modelClass: ModelClass<UserSettingsModel>
  ) { }

  async create(createUserSettingsDto: CreateUserSettingsDto[]) {
    return await this.modelClass.query().insert(createUserSettingsDto);
  }

  async findAll(params: any = {}) {
    return await this.modelClass.query().paginate(params).filter(params).withGraphFetched('settings').find()
  }

  async findOne(id: number) {
    return await this.modelClass.query().findById(id).find()
  }

  async update(id: number, updateUserSettingsDto: UpdateUserSettingsDto) {
    return await this.modelClass.query().findById(id).update(updateUserSettingsDto)
  }

  async remove(id: number) {
    return await this.modelClass.query().softDelete(id)
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
