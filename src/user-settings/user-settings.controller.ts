import {
  Body,
  Controller,
  Delete,
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
import { CreateUserSettingsDto } from './dto/create-user-settings.dto';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { UserSettingsService } from './user-settings.service';

@Controller('user-settings')
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Post()
  async create(@Body() createUserSettingsDto: CreateUserSettingsDto[]) {
    try {
      return await this.userSettingsService.create(createUserSettingsDto);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Get()
  async findAll(@Query() query: any) {
    return await this.userSettingsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    const data = await this.userSettingsService.findOne(id);
    if (data) {
      return response.status(HttpStatus.OK).send(data);
    }
    return response.status(HttpStatus.NOT_FOUND).send({
      message: 'No User Setting Found',
    });
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserSettingsDto: UpdateUserSettingsDto) {
    try {
      return await this.userSettingsService.update(id, updateUserSettingsDto);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.userSettingsService.remove(id);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
