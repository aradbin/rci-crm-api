import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  create(@Body() createCustomerDto: CreateCustomerDto, @UploadedFile() avatar: Express.Multer.File) {
    return this.customerService.create(createCustomerDto, avatar);
  }

  @Get()
  findAll(@Query() query) {
    return this.customerService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto, @UploadedFile() avatar: Express.Multer.File) {
    return this.customerService.update(+id, updateCustomerDto, avatar);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}
