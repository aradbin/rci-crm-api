import { Inject, Injectable } from '@nestjs/common';
import { CreateUserSettingsDto } from './dto/create-user-settings.dto';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { ModelClass } from 'objection';
import { UserSettingsModel } from './user-settings.model';

@Injectable()
export class UserSettingsService {
  constructor(
    @Inject('UserSettingsModel') private modelClass: ModelClass<UserSettingsModel>
  ) {}

  async create(createUserSettingsDto: CreateUserSettingsDto) {
    return await this.modelClass.query().insert(createUserSettingsDto);
  }

  async findAll(params: any = {}) {
    return await this.modelClass.query().find().paginate(params).filter(params)
  }

  async findOne(id: number) {
    return await this.modelClass.query().find().findById(id)
  }

  async update(id: number, updateUserSettingsDto: UpdateUserSettingsDto) {
    return await this.modelClass.query().findById(id).update(updateUserSettingsDto)
  }

  async remove(id: number) {
    return await this.modelClass.query().softDelete(id)
  }
}
