import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CustomerModel } from 'src/customer/customer.model';
import { SocketGateway } from 'src/socket/socket.gateway';
import { TaskService } from 'src/task/task.service';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { PhoneLogModel } from './phone.model';

@Injectable()
export class PhoneService {
  constructor(
    @Inject('PhoneLogModel') private modelClass: ModelClass<PhoneLogModel>,
    @Inject('CustomerModel') private customerModelClass: ModelClass<CustomerModel>,
    private readonly socketGateway: SocketGateway,
    private readonly taskService: TaskService,
  ) {}

  async create(createPhoneDto: CreatePhoneDto) {
    const customer = await this.customerModelClass
      .query()
      .where((whereQuery) =>
        whereQuery
          .whereLike('contact', `%${createPhoneDto.number}%`)
          .orWhereLike('optional_contact', `%${createPhoneDto.number}%`),
      )
      .where('deleted_at', null)
      .first();

    if (customer) {
      createPhoneDto.customer_id = customer.id;
    }

    return await this.modelClass.query().insert(createPhoneDto);
  }

  async findAll(params: any) {
    return await this.modelClass.query().withGraphFetched('customer').paginate(params).filter(params).find();
  }

  async findOne(id: number) {
    return await this.modelClass.query().findById(id).first().find();
  }

  async update(id: number, updatePhoneDto: UpdatePhoneDto) {
    return await this.modelClass.query().findById(id).update(updatePhoneDto);
  }
}
