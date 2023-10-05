import { Controller, Get, Post, Body, Req, Res, Query, Param, Patch, Delete } from '@nestjs/common';
import { Request, Response } from 'express';
import { WhatsappMessageService } from './whatsapp.message.service';
import { WhatsappSettingService, WhatsappUserService } from './whatsapp.service';

import {
  CreateWhatsappSettingDto,
  CreateWhatsappUserDto,
  SendTextMessageDto,
  UpdateWhatsappSettingDto,
  UpdateWhatsappUserDto,
} from './dto/whatsapp.dto';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappMessageService: WhatsappMessageService) {}

  @Post('send-message')
  async sendMessage(@Body() payload: SendTextMessageDto, @Res() res: Response) {
    // the function only returns response, throws an error
    const message = await this.whatsappMessageService.sendMessage(payload);
    res.status(200).json(message);
  }

  @Post('webhook')
  webhookPost(@Req() req: Request, @Res() res: Response) {
    // process the message
    console.log('Received this message from webhook:' + JSON.stringify(req.body, null, 3));
    res.status(200).json({ message: 'Thank you for the message' });
  }

  @Get('webhook')
  webhook(@Req() req: Request, @Res() res: Response): void {
    // Parse the query params
    const mode = req.query['hub.mode'] as string;
    const token = req.query['hub.verify_token'] as string;
    const challenge = req.query['hub.challenge'];

    this.whatsappMessageService.verifyWebhook(mode, token).then((status) => {
      if (status === 200) {
        res.status(status).send(challenge);
      }
      // return the error status
      res.sendStatus(status);
    });
  }
}

@Controller('whatsapp-settings')
export class WhatsAppSettingController {
  constructor(private readonly whatsappSettingService: WhatsappSettingService) {}

  @Post()
  create(@Body() createWhatsappSettingDto: CreateWhatsappSettingDto) {
    return this.whatsappSettingService.create(createWhatsappSettingDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.whatsappSettingService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.whatsappSettingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWhatsappSettingDto: UpdateWhatsappSettingDto) {
    return this.whatsappSettingService.update(+id, updateWhatsappSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.whatsappSettingService.remove(+id);
  }
}

@Controller('whatsapp-users')
export class WhatsappUserController {
  constructor(private readonly whatsappUserService: WhatsappUserService) {}

  @Post()
  create(@Body() createWhatsappUserDto: CreateWhatsappUserDto) {
    return this.whatsappUserService.create(createWhatsappUserDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.whatsappUserService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.whatsappUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWhatsappUserDto: UpdateWhatsappUserDto) {
    return this.whatsappUserService.update(+id, updateWhatsappUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.whatsappUserService.remove(+id);
  }
}
