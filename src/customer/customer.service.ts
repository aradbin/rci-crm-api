import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ModelClass } from 'objection';
import { CustomerModel } from './customer.model';

@Injectable()
export class CustomerService {
  constructor(
    @Inject('CustomerModel') private modelClass: ModelClass<CustomerModel>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const customer = await this.modelClass
      .query()
      .find()
      .where('email', createCustomerDto.email)
      .first();
    if (customer) {
      throw new NotAcceptableException('Email already exists');
    }
    return await this.modelClass.query().insert(createCustomerDto);
  }

  async findAll(params: any = {}) {
    return await this.modelClass.query().find().paginate(params).filter(params);
  }

  async findOne(id: number) {
    return await this.modelClass.query().find().findById(id);
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.modelClass
      .query()
      .find()
      .where('id', '!=', id)
      .where('email', updateCustomerDto.email)
      .first();
    if (customer) {
      throw new NotAcceptableException('Email already exists');
    }
    return await this.modelClass.query().findById(id).update(updateCustomerDto);
  }

  async remove(id: number) {
    return await this.modelClass.query().softDelete(id);
  }
}
