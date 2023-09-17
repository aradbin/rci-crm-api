import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingModel } from './setting.model';

@Injectable()
export class SettingsService {
  constructor(
    @Inject('SettingModel') private modelClass: ModelClass<SettingModel>
  ) {}

  async create(createSettingDto: CreateSettingDto) {
    return await this.modelClass.query().insert(createSettingDto);
  }

  async findAll(params: any = {}) {
    return await this.modelClass.query().find().paginate(params).filter(params)
  }

  async findOne(id: number) {
    return await this.modelClass.query().find().findById(id)
  }

  async update(id: number, updateSettingDto: UpdateSettingDto) {
    return await this.modelClass.query().findById(id).update(updateSettingDto)
  }

  async remove(id: number) {
    return await this.modelClass.query().softDelete(id)
  }
}
