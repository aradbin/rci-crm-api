import { Inject, Injectable } from '@nestjs/common';
import { CreateUserEmailDto } from './dto/create-user-email.dto';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { UserEmailModel } from './user-email.model';
import { ModelClass } from 'objection';

@Injectable()
export class UserEmailsService {
  constructor(
    @Inject('UserEmailModel') private modelClass: ModelClass<UserEmailModel>
  ) {}

  async create(createUserEmailDto: CreateUserEmailDto) {
    return await this.modelClass.query().insert(createUserEmailDto);
  }

  async findAll(params: any = {}) {
    return await this.modelClass.query().find().paginate(params).filter(params)
  }

  async findOne(id: number) {
    return await this.modelClass.query().find().findById(id)
  }

  async update(id: number, updateUserEmailsDto: UpdateUserEmailDto) {
    return await this.modelClass.query().findById(id).update(updateUserEmailsDto)
  }

  async remove(id: number) {
    return await this.modelClass.query().softDelete(id)
  }
}
