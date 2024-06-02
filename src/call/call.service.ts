import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CustomerModel } from 'src/customer/customer.model';
import { SocketGateway } from 'src/socket/socket.gateway';
import { TaskService } from 'src/task/task.service';
import { CallLogModel } from './call.model';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';

@Injectable()
export class CallService {
  constructor(
    @Inject('CallLogModel') private modelClass: ModelClass<CallLogModel>,
    @Inject('CustomerModel') private customerModelClass: ModelClass<CustomerModel>,
    private readonly socketGateway: SocketGateway,
    private readonly taskService: TaskService,
  ) {}

  async create(createCallDto: CreateCallDto) {
    const customer = await this.customerModelClass
      .query()
      .where((whereQuery) =>
        whereQuery
          .whereLike('contact', `%${createCallDto.number}%`)
          .orWhereLike('optional_contact', `%${createCallDto.number}%`),
      )
      .where('deleted_at', null)
      .first();

    if (customer) {
      createCallDto.customer_id = customer.id;
    }

    return await this.modelClass.query().insert(createCallDto);
  }

  async findAll(params: any) {
    return await this.modelClass.query().paginate(params).filter(params).find();
  }

  async findOne(id: number) {
    return await this.modelClass.query().findById(id).first().find();
  }

  async update(id: number, updateCallDto: UpdateCallDto) {
    return await this.modelClass.query().findById(id).update(updateCallDto);
  }
}
