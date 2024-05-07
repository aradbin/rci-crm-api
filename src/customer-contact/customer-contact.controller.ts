import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CustomerContactService } from './customer-contact.service';
import { CreateCustomerContactDto } from './dto/create-customer-contact.dto';
import { UpdateCustomerContactDto } from './dto/update-customer-contact.dto';

@Controller('customer-contacts')
export class CustomerContactController {
  constructor(private readonly customerContactService: CustomerContactService) {}

  @Post()
  async create(@Body() createCustomerContactDto: CreateCustomerContactDto) {
    return await this.customerContactService.create(createCustomerContactDto);
  }

  @Get()
  async findAll(@Query() query) {
    return await this.customerContactService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.customerContactService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCustomerContactDto: UpdateCustomerContactDto) {
    return await this.customerContactService.update(id, updateCustomerContactDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.customerContactService.remove(id);
  }
}
