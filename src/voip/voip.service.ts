import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { VoipLogModel } from './voip.model';
import { SocketGateway } from 'src/socket/socket.gateway';
import { CustomerModel } from 'src/customer/customer.model';
import { UpdateVoipDto } from './dto/update-voip.dto';
import { CreateVoipDto } from './dto/create-voip.dto';

@Injectable()
export class VoipService {
  constructor(
    @Inject('VoipLogModel') private modelClass: ModelClass<VoipLogModel>,
    @Inject('CustomerModel') private customerModelClass: ModelClass<CustomerModel>,
    private readonly socketGateway: SocketGateway
  ) { }

  async create(params: any) {
    // url for horizon integrator
    // http://54.179.73.207:8080/voip/create?id={Call.Id}&start={Call.Start}&state={Call.State}&duration={Call.Duration}&direction={Call.Direction}&remoteTel={Call.RemoteTel}&remoteTelE164={Call.RemoteTelE164}&remoteName={Call.RemoteName}&localTel={Call.LocalTel}&localName={Call.LocalName}

    const log = await this.modelClass.query().where('call_id', params?.id).withGraphFetched('received').withGraphFetched('customer').find().first();

    if (log) {
      const updated = await this.modelClass
        .query()
        .update({ log: JSON.stringify(params) })
        .where('call_id', params.id);
      if (params.state === 'Connected') {
        await this.socketGateway.handleVoIP(log);
      }

      return updated;
    }

    const createVoipDto: CreateVoipDto = {
      call_id: params.id,
      local_number: params.localTel,
      remote_number: params.remoteTel,
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
    return await this.modelClass.query().paginate(params).filter(params).find();
  }

  async update(id: number, updateVoipDto: UpdateVoipDto) {
    return await this.modelClass.query().findById(id).update(updateVoipDto);
  }
}
