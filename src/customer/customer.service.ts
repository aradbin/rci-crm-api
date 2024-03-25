import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { ModelClass } from 'objection';
import { MinioService } from 'src/minio/minio.service';
import { CustomerModel } from './customer.model';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(@Inject('CustomerModel') private modelClass: ModelClass<CustomerModel>, private readonly minioService: MinioService) {}

  async create(createCustomerDto: CreateCustomerDto, avatar: Express.Multer.File) {
    const customer = await this.modelClass.query().where('email', createCustomerDto.email).find().first();
    if (customer) {
      throw new NotAcceptableException('Email already exists');
    }

    if (avatar !== undefined) {
      createCustomerDto.avatar = await this.minioService.uploadFile(avatar);
    } else {
      delete createCustomerDto.avatar;
    }

    const newCustomer = await this.modelClass.query().insert(createCustomerDto);
    if (newCustomer['avatar']) {
      newCustomer['avatar'] = await this.minioService.getFileUrl(newCustomer['avatar']);
    }

    return newCustomer;
  }

  async findAll(params = {}) {
    const customers = await this.modelClass.query().paginate(params).filter(params).find();

    await Promise.all(
      customers['results'].map(async (customer: CustomerModel) => {
        if (customer['avatar']) {
          customer['avatar'] = await this.minioService.getFileUrl(customer['avatar']);
        }
      }),
    );

    return customers;
  }

  async findOne(id: number) {
    const customer = await this.modelClass.query().findById(id).find();
    if (customer['avatar']) {
      customer['avatar'] = await this.minioService.getFileUrl(customer['avatar']);
    }
    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto, avatar: Express.Multer.File) {
    const customer = await this.modelClass.query().where('id', '!=', id).where('email', updateCustomerDto.email).find().first();
    if (customer) {
      throw new NotAcceptableException('Email already exists');
    }
    if (avatar !== undefined) {
      updateCustomerDto.avatar = await this.minioService.uploadFile(avatar);
    } else {
      delete updateCustomerDto.avatar;
    }

    return await this.modelClass.query().findById(id).update(updateCustomerDto);
  }

  async remove(id: number) {
    return await this.modelClass.query().softDelete(id);
  }
}
