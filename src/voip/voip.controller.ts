import { Controller, Get, Patch, Param, Query, UnprocessableEntityException, ParseIntPipe, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { VoipService } from './voip.service';
import { Public } from 'src/auth/public.decorators';
import { UpdateVoipDto } from './dto/update-voip.dto';

@Controller('voip')
export class VoipController {
  constructor(private readonly voipService: VoipService) { }

  @Get('create')
  @Public()
  async create(@Query() params: any) {
    try {
      return await this.voipService.create(params);
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  @Get('list')
  findAll(@Query() params: any) {
    return this.voipService.findAll(params);
  }

  @Get('details/:id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    const data = await this.voipService.findOne(id);

    if (data) {
      return response.status(HttpStatus.OK).send(data);
    }
    return response.status(HttpStatus.NOT_FOUND).send({
      message: 'No Log Found',
    });
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateVoipDto: UpdateVoipDto) {
    try {
      return await this.voipService.update(id, updateVoipDto);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
