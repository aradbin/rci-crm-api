import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CreateSocketDto } from './dto/create-socket.dto';

@Injectable()
export class SocketService {
  constructor(
    // @Inject('CustomerModel') private modelClass: ModelClass<CustomerModel>,
  ) { }

  async create(createSocketDto: CreateSocketDto) {
    // const customer = await this.modelClass.query().where('email', createSocketDto.email).find().first();
    // if (customer) {
    //   throw new NotAcceptableException('Email already exists');
    // }
    // return await this.modelClass.query().insert(createSocketDto);
  }

  async findAll(params: any = {}) {
    //   return await this.modelClass.query().paginate(params).filter(params).find();
  }

  // async findOne(id: number) {
  //   return await this.modelClass.query().findById(id).find();
  // }

  // async update(id: number, updateCustomerDto: UpdateCustomerDto) {
  //   const customer = await this.modelClass.query().where('id', '!=', id).where('email', updateCustomerDto.email).find().first();
  //   if (customer) {
  //     throw new NotAcceptableException('Email already exists');
  //   }
  //   return await this.modelClass.query().findById(id).update(updateCustomerDto);
  // }

  // async remove(id: number) {
  //   return await this.modelClass.query().softDelete(id);
  // }
}
