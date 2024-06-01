import { Inject, Injectable, NotAcceptableException, UnprocessableEntityException } from '@nestjs/common';
import * as crypto from 'crypto';
import { ModelClass } from 'objection';
import { EmailService } from 'src/email/email.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsModel } from './settings.model';

@Injectable()
export class SettingsService {
  constructor(
    @Inject('SettingsModel') private modelClass: ModelClass<SettingsModel>,
    private emailService: EmailService
  ) { }

  async create(createSettingDto: CreateSettingDto) {
    if (createSettingDto.type === 'email') {
      let folders = null;
      await this.emailService.getFolders({
        username: createSettingDto.metadata.username,
        password: createSettingDto.metadata.password,
        imap: createSettingDto.metadata.imap,
      }).then((response) => {
        folders = response;
      }).catch(() => {
        throw new UnprocessableEntityException("Couldn't connect to email address");
      });
      if(folders?.length > 0){
        createSettingDto.metadata.folders = folders;
      }
      createSettingDto.metadata.password = this.encryptPassword(createSettingDto.metadata.password);
    }

    return await this.modelClass.query().insert(createSettingDto);
  }

  async findAll(params: any = {}) {
    return await this.modelClass.query().paginate(params).filter(params).withGraphFetched('parent').withGraphFetched('children').find();
  }

  async findAllForCustomerService(customerId: number) {
    return await this.modelClass.query()
      .filter({ type: 'service' })
      .paginate({ page: 1, pageSize: 999999999 })
      .withGraphFetched('customerSettingsSingle')
      .modifyGraph('customerSettingsSingle', (builder) => {
        builder.where('customer_settings.customer_id', customerId);
      })
      .find();
  }

  async findOne(id: number) {
    return await this.modelClass.query().findById(id).withGraphFetched('parent').withGraphFetched('children').find()
  }

  async update(id: number, updateSettingDto: UpdateSettingDto) {
    if (updateSettingDto.type === 'email') {
      const emailSettings = await this.findOne(id);
      if (!emailSettings) {
        throw new NotAcceptableException("Email settings not found");
      }
      if (updateSettingDto?.metadata?.password !== emailSettings?.metadata?.password) {
        updateSettingDto.metadata.password = this.encryptPassword(updateSettingDto.metadata.password)
      }
    }

    return await this.modelClass.query().findById(id).update(updateSettingDto)
  }

  async remove(id: number) {
    return await this.modelClass.query().softDelete(id)
  }

  encryptPassword(str: string) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32); // 256-bit key
    const iv = crypto.randomBytes(16); // 128-bit IV

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedData = cipher.update(str, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    const password = key.toString('hex') + iv.toString('hex') + encryptedData

    return password;
  }
}
