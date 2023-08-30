import { Controller, Get, Post, Body, Patch, Param, Delete, UnprocessableEntityException } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  async create(@Body() createEmailDto: CreateEmailDto) {
    try {
      const data = await this.emailService.create(createEmailDto);
      return {
        message: '',
        data: data
      }
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  @Get()
  async find() {
    return await this.emailService.find();
  }
}
