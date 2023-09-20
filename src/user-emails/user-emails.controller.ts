import { Controller, Get, Post, Body, Patch, Param, Delete, UnprocessableEntityException, Query, ParseIntPipe, Res, HttpStatus } from '@nestjs/common';
import { UserEmailsService } from './user-emails.service';
import { CreateUserEmailDto } from './dto/create-user-email.dto';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';
import { Response } from 'express';

@Controller('user-emails')
export class UserEmailsController {
  constructor(private readonly userEmailsService: UserEmailsService) {}

  @Post()
  async create(@Body() createUserEmailDto: CreateUserEmailDto) {
    try {
      const data = await this.userEmailsService.create(createUserEmailDto);
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
    return await this.userEmailsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    const data = await this.userEmailsService.findOne(id);
    if(data){
      return response.status(HttpStatus.OK).send(data)
    }else{
      return response.status(HttpStatus.NOT_FOUND).send({
        message: 'No User Setting Found'
      })
    }
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserEmailDto: UpdateUserEmailDto) {
    try {
      await this.userEmailsService.update(id, updateUserEmailDto);
      return {
        message: 'User Setting Updated Successfully',
        data: id
      }
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.userEmailsService.remove(id);
      return {
        message: 'Setting Deleted Successfully',
        data: id
      }
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }
}
