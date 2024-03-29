import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CustomerModel } from 'src/customer/customer.model';
import { TaskStatus } from 'src/database/enums/tasks';
import { SocketGateway } from 'src/socket/socket.gateway';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';
import { TaskService } from 'src/task/task.service';
import { CreateVoipDto } from './dto/create-voip.dto';
import { UpdateVoipDto } from './dto/update-voip.dto';
import { VoipLogModel } from './voip.model';

@Injectable()
export class VoipService {
  constructor(
    @Inject('VoipLogModel') private modelClass: ModelClass<VoipLogModel>,
    @Inject('CustomerModel') private customerModelClass: ModelClass<CustomerModel>,
    private readonly socketGateway: SocketGateway,
    private readonly taskService: TaskService
  ) { }

  async create(params: any) {
    // url for horizon integrator
    // http://54.179.73.207:8080/voip/create?id={Call.Id}&start={Call.Start}&state={Call.State}&duration={Call.Duration}&direction={Call.Direction}&remoteTel={Call.RemoteTel}&remoteTelE164={Call.RemoteTelE164}&remoteName={Call.RemoteName}&localTel={Call.LocalTel}&localName={Call.LocalName}

    const log = await this.modelClass.query().where('call_id', params?.id).withGraphFetched('received').withGraphFetched('customer').find().first();

    if (log) {
      let state = log?.state;
      if (params.state === 'Connected') {
        await this.socketGateway.handleVoIP(log);
        state = "Connected";
      }
      if (params.state === 'Terminated' && log?.state === 'Missed') {
        const createTaskDto: CreateTaskDto = {
          title: `Missed VoIP call from ${log?.remote_number}`,
          description: "",
          priority: 3,
          status: TaskStatus.TODO,
          due_date: new Date(),
          assignee_id: null,
          attachments: null,
          customer_id: log?.customer_id || null,
          parent_id: null,
          estimation: "",
          reporter_id: null,
          running: false,
          time_log: null,
          type_id: null
        };
        await this.taskService.create(createTaskDto, []);
      }
      const updated = await this.modelClass
        .query()
        .update({ state: state, log: JSON.stringify(params) })
        .where('call_id', params.id);

      return updated;
    }

    const createVoipDto: CreateVoipDto = {
      call_id: params.id,
      local_number: params.localTel,
      remote_number: params.remoteTel,
      state: "Missed",
      log: JSON.stringify(params),
      received_by: null,
      customer_id: null,
      note: null
    }

    const customer = await this.customerModelClass.query()
      .where(whereQuery => whereQuery
        .whereLike('contact', `%${params.remoteTel}%`)
        .orWhereLike('optional_contact', `%${params.remoteTel}%`)
      ).where('deleted_at', null)
      .first();

    if (customer) {
      createVoipDto.customer_id = customer.id
    }

    return await this.modelClass.query().insert(createVoipDto);
  }

  async findAll(params: any) {
    return await this.modelClass.query().withGraphFetched('received').withGraphFetched('customer').paginate(params).filter(params).find();
  }

  async findOne(id: number) {
    return await this.modelClass.query().findById(id).withGraphFetched('received').withGraphFetched('customer').first().find();
  }

  async update(id: number, updateVoipDto: UpdateVoipDto) {
    return await this.modelClass.query().findById(id).update(updateVoipDto);
  }
}
