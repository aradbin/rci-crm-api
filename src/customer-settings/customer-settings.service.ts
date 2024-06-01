import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { ModelClass } from 'objection';
import { CronJobService } from 'src/cron-job/cron-job.service';
import { CreateCronJobDto } from 'src/cron-job/dto/create-cron-job.dto';
import { UpdateCronJobDto } from 'src/cron-job/dto/update-cron-job.dto';
import { SettingsService } from 'src/settings/settings.service';
import { CustomerSettingsModel } from './customer-settings.model';
import { CreateCustomerSettingDto } from './dto/create-customer-setting.dto';
import { UpdateCustomerSettingDto } from './dto/update-customer-setting.dto';

@Injectable()
export class CustomerSettingsService {
    constructor(
        @Inject('CustomerSettingsModel') private modelClass: ModelClass<CustomerSettingsModel>,
        private cronJobService: CronJobService,
        private settingsService: SettingsService,
    ) {}

    async create(createCustomerSettingsDto: CreateCustomerSettingDto) {
        const existing = await this.modelClass.query().filter({ customer_id: createCustomerSettingsDto.customer_id, settings_id: createCustomerSettingsDto.settings_id }).first().find();
        if(existing){
            return this.update(existing.id, {...createCustomerSettingsDto, updated_at: null, updated_by: null, deleted_at: null, deleted_by: null});
        }

        const cs = await this.modelClass.query().insert(createCustomerSettingsDto);
        if(createCustomerSettingsDto.metadata.auto_task){
            const settings = await this.settingsService.findOne(createCustomerSettingsDto.settings_id);
            if(settings?.metadata?.cycle !== 'onetime'){
                const payload: CreateCronJobDto = {
                    type: 'service',
                    type_id: cs.id,
                    next_run_time: this.nextRunTime(createCustomerSettingsDto.metadata.start_date, settings.metadata.cycle),
                    metadata: {...cs, settings: settings},
                    is_active: true,
                    created_at: null,
                    created_by: null
                }
                await this.cronJobService.create(payload);
            }
        }

        return cs;
    }

    async findAll(params: any = {}) {
        const result = await this.settingsService.findAllForCustomerService(parseInt(params?.customer_id));

        return {
            ...result,
            customer_id: params?.customer_id
        }
    }

    async findOne(id: number) {
        const cs = await this.modelClass.query().findById(id).find();
        if (cs) return cs;

        throw new NotFoundException('Customer Settings Not Found');
    }

    async update(id: number, updateCustomerSettingsDto: UpdateCustomerSettingDto) {
        await this.modelClass.query().findById(id).update(updateCustomerSettingsDto);
        const cs = await this.modelClass.query().findById(id).find();
        const cron = await this.cronJobService.findAll({ type: 'service', type_id: id });
        const exist = JSON.parse(JSON.stringify(cron))[0]

        if(exist){
            const settings = await this.settingsService.findOne(cs.settings_id);
            const payload: UpdateCronJobDto = {
                next_run_time: cs.metadata.auto_task ? this.nextRunTime(cs.metadata.start_date, settings.metadata.cycle) : null,
                metadata: {...cs, settings: settings},
                is_active: cs.is_active ? cs.metadata.auto_task : false
            }
            await this.cronJobService.update(exist.id, payload);
        }else{
            if(cs.metadata.auto_task){
                const settings = await this.settingsService.findOne(cs.settings_id);
                if(settings?.metadata?.cycle !== 'onetime'){
                    const payload: CreateCronJobDto = {
                        type: 'service',
                        type_id: id,
                        next_run_time: this.nextRunTime(cs.metadata.start_date, settings.metadata.cycle),
                        metadata: {...cs, settings: settings},
                        is_active: true,
                        created_at: null,
                        created_by: null
                    }
                    await this.cronJobService.create(payload);
                }
            }
        }

        return cs;
    }

    async remove(id: number) {
        return await this.modelClass.query().softDelete(id);
    }

    private nextRunTime(start_date, cycle) {
        let date = DateTime.fromJSDate(new Date(start_date));
        const today = DateTime.now().plus({ hours: 6 });

        while (date <= today) {
            switch (cycle) {
                case 'daily':
                    date = date.plus({ days: 1 });
                    break;
                case 'weekly':
                    date = date.plus({ weeks: 1 }).set({ weekday: start_date.weekday });
                    break;
                case 'monthly':
                    date = date.plus({ months: 1 }).set({ day: date.day });
                    break;
                case 'quarterly':
                    date = date.plus({ months: 3 }).set({ day: date.day });
                    break;
                case 'yearly':
                    date = date.plus({ years: 1 }).set({ month: date.month, day: date.day });
                    break;
                default:
                    throw new Error(`Invalid cycle: ${cycle}`);
            }
        }

        return date.toJSDate();
    }
}
