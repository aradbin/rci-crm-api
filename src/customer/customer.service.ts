import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { ModelClass } from 'objection';
import { CustomerSettingsService } from 'src/customer-settings/customer-settings.service';
import { MinioService } from 'src/minio/minio.service';
import { CustomerModel } from './customer.model';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
    constructor(
        @Inject('CustomerModel') private modelClass: ModelClass<CustomerModel>,
        private customerSettingsService: CustomerSettingsService,
        private readonly minioService: MinioService,
    ) {}

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

        const settings_id = createCustomerDto.settings_id;
        delete createCustomerDto.settings_id;

        const newCustomer = await this.modelClass.query().insert(createCustomerDto);
        if (newCustomer?.id && settings_id?.length > 0) {
            const customerSettings = [];
            settings_id?.map((item) => {
                customerSettings.push({
                    customer_id: newCustomer.id,
                    settings_id: item,
                });
            });
            await this.customerSettingsService.create(customerSettings);
        }

        if (newCustomer['avatar']) {
            newCustomer['avatar'] = await this.minioService.getFileUrl(newCustomer['avatar']);
        }
        return newCustomer;
    }

    async findAll(params = {}) {
        const customers = await this.modelClass
            .query()
            .paginate(params)
            .filter(params)
            .withGraphFetched('customerSettings.settings')
            .find();

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
        const customer = await this.modelClass
            .query()
            .findById(id)
            .withGraphFetched('customerSettings.settings')
            .first()
            .find();
        if (customer['avatar']) {
            customer['avatar'] = await this.minioService.getFileUrl(customer['avatar']);
        }
        return customer;
    }

    async update(id: number, updateCustomerDto: UpdateCustomerDto, avatar: Express.Multer.File) {
        const hasCustomer = await this.modelClass
            .query()
            .where('id', '!=', id)
            .where('email', updateCustomerDto.email)
            .find()
            .first();
        if (hasCustomer) {
            throw new NotAcceptableException('Email already exists');
        }

        if (avatar !== undefined) {
            updateCustomerDto.avatar = await this.minioService.uploadFile(avatar);
        } else {
            delete updateCustomerDto.avatar;
        }

        const settingsId = updateCustomerDto.settings_id;
        delete updateCustomerDto.settings_id;

        const customer = await this.modelClass.query().findById(id).update(updateCustomerDto);
        if (customer > 0) {
            const existingCustomerSettings = [];
            let index = -1;
            const response = await this.customerSettingsService.findAll({ user_id: id });

            response['results']?.map((item) => {
                if (settingsId.includes(item?.settings_id)) {
                    index = settingsId.indexOf(item?.settings_id);
                    settingsId.splice(index, 1);
                } else {
                    existingCustomerSettings.push(item?.id);
                }
            });

            if (settingsId?.length > 0) {
                const customerSettings = [];
                settingsId.map((item) => {
                    customerSettings.push({
                        customer_id: id,
                        settings_id: item,
                    });
                });
                await this.customerSettingsService.create(customerSettings);
            }

            existingCustomerSettings?.map(async (item) => {
                await this.customerSettingsService.remove(item);
            });
        }

        return customer;
    }

    async remove(id: number) {
        return await this.modelClass.query().softDelete(id);
    }
}
