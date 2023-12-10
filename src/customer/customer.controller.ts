import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Public } from 'src/auth/public.decorators';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.customerService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}

@Controller('web/xmlrpc')
export class RpcController {
  @Public()
  @Get(':slug')
  create(@Req() Req, @Res() res) {
    console.log(Req.route.path);
    res.sendStatus(200);
  }
}
