import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CustomerModel } from 'src/customer/customer.model';
import { SettingsService } from 'src/settings/settings.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { TaskService } from 'src/task/task.service';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { PhoneLogModel } from './phone.model';

@Injectable()
export class PhoneService {
  constructor(
    @Inject('PhoneLogModel') private modelClass: ModelClass<PhoneLogModel>,
    @Inject('CustomerModel') private customerModelClass: ModelClass<CustomerModel>,
    private readonly socketGateway: SocketGateway,
    private readonly taskService: TaskService,
    private settingsService: SettingsService
  ) {}

  async create(createPhoneDto: any) {
    const phoneSettings = await this.getPhoneSettings(createPhoneDto.ownNumber);

    const logIds = createPhoneDto.callList.map(call => call.id)

    const existingLogs = await this.modelClass.query()
      .where('settings_id', phoneSettings?.id)
      .where('type', createPhoneDto.type)
      .whereIn('log_id', logIds)
      .find();

    const filtered = createPhoneDto.callList?.filter((item: any) => {
      const has = JSON.parse(JSON.stringify(existingLogs))?.find((log: any) => log?.log_id === item?.id);
      if(!has){
        return true
      }

      return false
    })
    
    const payload = await Promise.all(
      filtered.map(async (item: any) => {
        const customer = await this.customerModelClass
          .query()
          .where((whereQuery) =>
            whereQuery
              .whereLike('contact', `%${item.number}%`)
              .orWhereLike('optional_contact', `%${item.number}%`)
          )
          .where('deleted_at', null)
          .first();

        return {
          settings_id: phoneSettings?.id,
          customer_id: customer?.id || null,
          number: item.phoneNumber,
          type: createPhoneDto.type,
          log_id: item.id,
          log: item
        }; 
      })
    );

    if(payload?.length > 0){
      return await this.modelClass.query().insert(payload);
    }

    return false;
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

  async getPhoneSettings(number: number) {
    let phoneSettings = null;
    await this.settingsService.findAll({ deleted_at: null, type: 'phone' }).then((response: any) => {
      response?.map((item: any) => {
        if (item?.metadata?.number?.includes(number)) {
          phoneSettings = item
        }
      })
    });

    if (!phoneSettings) {
      throw new UnprocessableEntityException("phone config not found. Please config your phone");
    }

    return phoneSettings
  }
}

