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
import { CallService } from './call.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';

@Controller('calls')
export class CallController {
  constructor(private readonly callService: CallService) {}

  @Post()
  async create(@Body() createCallDto: CreateCallDto) {
    try {
      return await this.callService.create(createCallDto);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Get()
  async findAll(@Query() params: any) {
    return await this.callService.findAll(params);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    const data = await this.callService.findOne(id);

    if (data) {
      return response.status(HttpStatus.OK).send(data);
    }
    return response.status(HttpStatus.NOT_FOUND).send({
      message: 'No Log Found',
    });
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCallDto: UpdateCallDto) {
    try {
      return await this.callService.update(id, updateCallDto);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
