import { Inject, Injectable } from '@nestjs/common';
import { CreateVoipDto } from './dto/create-voip.dto';
import { UpdateVoipDto } from './dto/update-voip.dto';
import { ModelClass } from 'objection';
import { VoipLogModel } from './voip.model';

@Injectable()
export class VoipService {
  constructor(@Inject('VoipLogModel') private modelClass: ModelClass<VoipLogModel>) { }

  create(createVoipDto: CreateVoipDto) {
    return 'This action adds a new voip';
  }

  hook(params: any) {
    console.log(params);
    const call_id = params.id;
    const local_number = params.localTel;
    const remote_number = params.remoteTel;

    const log = this.modelClass.query().where('call_id', call_id).find().first();
    if (log) {
      const updated = this.modelClass
        .query()
        .update({ log: JSON.stringify(params) })
        .where('call_id', call_id);
      return updated;
    }

    return this.modelClass.query().insert({ call_id, local_number, remote_number, log: JSON.stringify(params) });
  }

  findAll(params: any) {
    const { local_number, remote_number } = params;

    const query = this.modelClass.query();
    if (local_number) {
      query.where('local_number', local_number);
    }
    if (remote_number) {
      query.where('remote_number', remote_number);
    }
    return query.find().paginate(params);
  }

  findOne(id: number) {
    return `This action returns a #${id} voip`;
  }

  update(id: number, updateVoipDto: UpdateVoipDto) {
    return `This action updates a #${id} voip`;
  }

  remove(id: number) {
    return `This action removes a #${id} voip`;
  }
}
