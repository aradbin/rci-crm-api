import { Controller, Get, Post, Body, Req, Query, Param, ParseIntPipe } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Post()
  async create(@Req() req: any, @Body() createMessageDto: CreateMessageDto) {
    return await this.messageService.create(req?.user?.id, createMessageDto);
  }

  @Get()
  async findAll(@Req() req: any, @Query() query: any) {
    return await this.messageService.findAll(req?.user?.id, query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Query() query: any) {
    return await this.messageService.findOne(id, query);
  }
}
