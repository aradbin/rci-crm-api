import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { ModelClass } from 'objection';
import { CustomerSettingsModel } from './customer-settings-model';
import { CreateCustomerSettingDto } from './dto/create-customer-setting.dto';
import { UpdateCustomerSettingDto } from './dto/update-customer-setting.dto';

@Injectable()
export class CustomerSettingsService {
    constructor(@Inject('CustomerSettingsModel') private modelClass: ModelClass<CustomerSettingsModel>) {}

    async create(createCustomerSettingsDto: CreateCustomerSettingDto[]) {
        return await this.modelClass.query().insert(createCustomerSettingsDto);
    }

    async findAll(params = {}) {
        return await this.modelClass.query().paginate(params).filter(params).withGraphFetched('settings').find();
    }

    async findOne(id: number) {
        const cs = await this.modelClass.query().findById(id).find();
        if (cs) return cs;

        throw new NotFoundException('not found');
    }

    async update(id: number, updateCustomerSettingsDto: UpdateCustomerSettingDto) {
        const cs = await this.modelClass.query().findById(id).update(updateCustomerSettingsDto);
        if (cs) return cs;

        throw new NotFoundException('not found');
    }

    async remove(id: number) {
        return await this.modelClass.query().softDelete(id);
    }

    decryptPassword(str: string) {
        const algorithm = 'aes-256-cbc';
        const keyForDecryption = Buffer.from(str.slice(0, 64), 'hex');
        const ivForDecryption = Buffer.from(str.slice(64, 96), 'hex');
        const encryptedDataForDecryption = str.slice(96);

        const decipher = crypto.createDecipheriv(algorithm, keyForDecryption, ivForDecryption);
        let decryptedData = decipher.update(encryptedDataForDecryption, 'hex', 'utf8');
        decryptedData += decipher.final('utf8');

        return decryptedData;
    }
}
