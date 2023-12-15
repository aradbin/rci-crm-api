import { Inject, Injectable } from '@nestjs/common';
import { CreateVoipDto } from './dto/create-voip.dto';
import { UpdateVoipDto } from './dto/update-voip.dto';
import { ModelClass } from 'objection';
import { VoipLogModel } from './voip.model';

@Injectable()
export class VoipService {
  constructor(@Inject('VoipLogModel') private modelClass: ModelClass<VoipLogModel>) { }

  async create(params: any) {
    // url for horizon integrator
    // http://54.179.73.207:8080/voip/create?id={Call.Id}&start={Call.Start}&state={Call.State}&duration={Call.Duration}&direction={Call.Direction}&remoteTel={Call.RemoteTel}&remoteTelE164={Call.RemoteTelE164}&remoteName={Call.RemoteName}&localTel={Call.LocalTel}&localName={Call.LocalName}

    // console.log(params);
    const call_id = params.id;
    const local_number = params.localTel;
    const remote_number = params.remoteTel;

    const log = this.modelClass.query().where('call_id', call_id).find().first();
    console.log('log', log);
    if (log) {
      return await this.modelClass
        .query()
        .update({ log: JSON.stringify(params) })
        .where('call_id', call_id);
    }

    return await this.modelClass.query().insert({ call_id, local_number, remote_number, log: JSON.stringify(params) });
  }

  async findAll(params: any) {
    return await this.modelClass.query().paginate(params).filter(params).find();
  }
}
