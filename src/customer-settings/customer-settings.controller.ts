import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CustomerSettingsService } from './customer-settings.service';
import { CreateCustomerSettingDto } from './dto/create-customer-setting.dto';
import { UpdateCustomerSettingDto } from './dto/update-customer-setting.dto';

@Controller('customer-settings')
export class CustomerSettingsController {
    constructor(private readonly customerSettingsService: CustomerSettingsService) {}

    @Post()
    async create(@Body() createCustomerSettingDto: CreateCustomerSettingDto[]) {
        return await this.customerSettingsService.create(createCustomerSettingDto);
    }

    @Get()
    async findAll(@Query() query) {
        return await this.customerSettingsService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.customerSettingsService.findOne(+id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateCustomerSettingDto: UpdateCustomerSettingDto) {
        return await this.customerSettingsService.update(+id, updateCustomerSettingDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.customerSettingsService.remove(+id);
    }
}
