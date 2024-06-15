import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { PhoneService } from './phone.service';

@Controller('phone')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @Post()
  async create(@Body() createPhoneDto: any) {
    console.log(createPhoneDto)
    try {
      return await this.phoneService.create(createPhoneDto);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Get()
  async findAll(@Query() params: any) {
    return await this.phoneService.findAll(params);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    const data = await this.phoneService.findOne(id);

    if (data) {
      return response.status(HttpStatus.OK).send(data);
    }
    return response.status(HttpStatus.NOT_FOUND).send({
      message: 'No Log Found',
    });
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePhoneDto: UpdatePhoneDto) {
    try {
      return await this.phoneService.update(id, updatePhoneDto);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
