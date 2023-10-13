import { Controller, Get, Post, Body, Patch, Param, Delete, UnprocessableEntityException, ParseIntPipe, Res, HttpStatus } from '@nestjs/common';
import { EmailSettingsService } from './email-settings.service';
import { CreateEmailSettingDto } from './dto/create-email-setting.dto';
import { UpdateEmailSettingDto } from './dto/update-email-setting.dto';
import { Response } from 'express';

@Controller('email-settings')
export class EmailSettingsController {
  constructor(private readonly emailSettingsService: EmailSettingsService) { }

  @Post()
  create(@Body() createEmailSettingDto: CreateEmailSettingDto) {
    try {
      return this.emailSettingsService.create(createEmailSettingDto);
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  // @Get()
  // findAll() {
  //   return this.emailSettingsService.findAll();
  // }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    const data = await this.emailSettingsService.findOne(id);

    if (data) {
      return response.status(HttpStatus.OK).send(data);
    }
    return response.status(HttpStatus.NOT_FOUND).send({
      message: 'No Settings Found',
    });
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateEmailSettingDto: UpdateEmailSettingDto, @Res() response: Response) {
    try {
      const updated = await this.emailSettingsService.update(id, updateEmailSettingDto);
      if (updated > 0) {
        const data = await this.emailSettingsService.findOne(id);
        if (data) {
          return response.status(HttpStatus.OK).send(data);
        }
      }
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.emailSettingsService.remove(+id);
  // }
}
