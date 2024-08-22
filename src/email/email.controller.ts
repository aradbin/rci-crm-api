import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  async create(@Body() createEmailDto: any) {
    return await this.emailService.create(createEmailDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return await this.emailService.findAll(query);
  }

  @Get('/folders')
  async folders(@Query() query: any) {
    return await this.emailService.folders(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.emailService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmailDto: UpdateEmailDto) {
    return this.emailService.update(+id, updateEmailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emailService.remove(+id);
  }
}
