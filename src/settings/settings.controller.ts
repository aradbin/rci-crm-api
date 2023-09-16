import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UnprocessableEntityException, Query, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  async create(@Body() createSettingDto: CreateSettingDto) {
    try {
      const data = await this.settingsService.create(createSettingDto);
      return {
        message: 'New Setting Created Successfully',
        data: data
      }
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  @Get()
  async findAll(@Query() query: any) {
    return await this.settingsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    const data = await this.settingsService.findOne(id);
    if(data){
      return response.status(HttpStatus.OK).send(data)
    }else{
      return response.status(HttpStatus.NOT_FOUND).send({
        message: 'No Setting Found'
      })
    }
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateSettingDto: UpdateSettingDto) {
    try {
      await this.settingsService.update(id, updateSettingDto);
      return {
        message: 'Setting Updated Successfully',
        data: id
      }
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.settingsService.remove(id);
      return {
        message: 'Setting Deleted Successfully',
        data: id
      }
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }
}
