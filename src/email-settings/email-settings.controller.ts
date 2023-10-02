import { Controller, Get, Post, Body, Patch, Param, Delete, UnprocessableEntityException } from '@nestjs/common';
import { EmailSettingsService } from './email-settings.service';
import { CreateEmailSettingDto } from './dto/create-email-setting.dto';
import { UpdateEmailSettingDto } from './dto/update-email-setting.dto';

@Controller('email-settings')
export class EmailSettingsController {
  constructor(private readonly emailSettingsService: EmailSettingsService) {}

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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.emailSettingsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEmailSettingDto: UpdateEmailSettingDto) {
  //   return this.emailSettingsService.update(+id, updateEmailSettingDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.emailSettingsService.remove(+id);
  // }
}
