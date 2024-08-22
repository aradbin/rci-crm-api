import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { UpdateWhatsappDto } from './dto/update-whatsapp.dto';
import { Response } from 'express';

@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly whatsappService: WhatsappService
  ) {}

  @Post()
  async create(@Body() createWhatsappDto: any) {
    return await this.whatsappService.create(createWhatsappDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return await this.whatsappService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.whatsappService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWhatsappDto: UpdateWhatsappDto) {
    return this.whatsappService.update(+id, updateWhatsappDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.whatsappService.remove(+id);
  }
}
