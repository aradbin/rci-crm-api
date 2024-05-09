import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CustomerContactModel } from './customer-contact-model';
import { CreateCustomerContactDto } from './dto/create-customer-contact.dto';
import { UpdateCustomerContactDto } from './dto/update-customer-contact.dto';

@Injectable()
export class CustomerContactService {
  constructor(
    @Inject('CustomerContactModel') private modelClass: ModelClass<CustomerContactModel>,
  ) {}

  async create(createCustomerContactDto: CreateCustomerContactDto) {
    return await this.modelClass.query().insert(createCustomerContactDto);
  }

  async findAll(params = {}) {
    return await this.modelClass.query().paginate(params).filter(params).withGraphFetched('customer').withGraphFetched('contact').find();
  }

  async findOne(id: number) {
    const cs = await this.modelClass.query().findById(id).find();
    if (cs) return cs;

    throw new NotFoundException('Customer Contact Not Found');
  }

  async update(id: number, updateCustomerContactDto: UpdateCustomerContactDto) {
    return await this.modelClass.query().findById(id).update(updateCustomerContactDto);
  }

  async remove(id: number) {
    return await this.modelClass.query().softDelete(id);
  }
}
