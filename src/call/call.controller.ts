import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/auth/public.decorators';
import { CallService } from './call.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';

@Controller('call')
export class CallController {
  constructor(private readonly callService: CallService) {}

  @Get('create')
  @Public()
  async create(@Body() createCallDto: CreateCallDto) {
    try {
      return await this.callService.create(createCallDto);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Get('list')
  findAll(@Query() params: any) {
    return this.callService.findAll(params);
  }

  @Get('details/:id')
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
