import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ModelClass } from 'objection';
import { ContactService } from 'src/contact/contact.service';
import { CustomerContactModel } from './customer-contact.model';
import { CreateCustomerContactDto } from './dto/create-customer-contact.dto';
import { UpdateCustomerContactDto } from './dto/update-customer-contact.dto';

@Injectable()
export class CustomerContactService {
  constructor(
    @Inject('CustomerContactModel') private modelClass: ModelClass<CustomerContactModel>,
    private contactService: ContactService,
  ) {}

  async create(createCustomerContactDto: CreateCustomerContactDto) {
    if (!createCustomerContactDto.contact_id) {
      let contact = await this.contactService.findByEmail(createCustomerContactDto.metadata.email);
      if (contact) {
        createCustomerContactDto.contact_id = contact?.id;
      } else {
        contact = await this.contactService.create(
          {
            name: createCustomerContactDto.metadata.name,
            email: createCustomerContactDto.metadata.email,
            contact: createCustomerContactDto.metadata.contact,
            address: createCustomerContactDto.metadata.address,
            is_active: true,
            avatar: null,
          },
          null,
        );
        createCustomerContactDto.contact_id = contact?.id;
      }
    }

    const exist: any = await this.findAll(createCustomerContactDto);
    if (exist?.length > 0) {
      throw new NotFoundException('Customer Contact Already Exists');
    }

    return await this.modelClass.query().insert(createCustomerContactDto);
  }

  async import(createCustomerContactDtos: CreateCustomerContactDto[]) {
    if (createCustomerContactDtos.length === 0) {
      throw new NotFoundException('No new data to import');
    }

    return await this.modelClass.query().insert(createCustomerContactDtos);
  }

  async findAll(params = {}) {
    return await this.modelClass
      .query()
      .paginate(params)
      .filter(params)
      .withGraphFetched('customer')
      .withGraphFetched('contact')
      .find();
  }

  async findOne(id: number) {
    const cs = await this.modelClass.query().withGraphFetched('contact').findById(id).find();
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
