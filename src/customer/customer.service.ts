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
    const customer = await this.modelClass.query().where('email', createCustomerDto.email).find().first();
    if (customer) {
      throw new NotAcceptableException('Email already exists');
    }
    return await this.modelClass.query().insert(createCustomerDto);
  }

  async findAll(params: any = {}) {
    return await this.modelClass.query().paginate(params).filter(params).find();
  }

  async findOne(id: number) {
    return await this.modelClass.query().findById(id).find();
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.modelClass.query().where('id', '!=', id).where('email', updateCustomerDto.email).find().first();
    if (customer) {
      throw new NotAcceptableException('Email already exists');
    }
    return await this.modelClass.query().findById(id).update(updateCustomerDto);
  }

  async remove(id: number) {
    return await this.modelClass.query().softDelete(id);
  }
}
