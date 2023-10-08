import { Controller, Get, Post, Body, Req, Res, Query, Param, Patch, Delete } from '@nestjs/common';
import { Request, Response } from 'express';
import { WhatsappMessageService } from './whatsapp.message.service';
import { WhatsappBusinessNumberService, WhatsappConversationService, WhatsappUserService } from './whatsapp.service';

import {
  CreateWhatsappBusinessNumberDto,
  CreateWhatsappConversationDto,
  CreateWhatsappUserDto,
  SendTextMessageDto,
  UpdateWhatsappBusinessNumberDto,
  UpdateWhatsappConversationDto,
  UpdateWhatsappUserDto,
} from './dto/whatsapp.dto';
import { WebhookPayload } from './dto/whatsapp.webhook.dto';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappMessageService: WhatsappMessageService) {}

  @Post('send-message')
  async sendMessage(@Body() payload: SendTextMessageDto, @Res() res: Response) {
    const message = await this.whatsappMessageService.sendMessage(payload);
    res.status(200).json(message);
  }

  @Post('webhook')
  async webhookPost(@Body() payload: WebhookPayload) {
    console.log('Received this message from webhook:' + JSON.stringify(payload, null, 3));
    return await this.whatsappMessageService.processWebhookEvent(payload);
  }

  @Get('webhook')
  webhook(@Req() req: Request, @Res() res: Response): void {
    const mode = req.query['hub.mode'] as string;
    const token = req.query['hub.verify_token'] as string;
    const challenge = req.query['hub.challenge'];

    this.whatsappMessageService.verifyWebhook(mode, token).then((status) => {
      if (status === 200) {
        res.status(status).send(challenge);
      }
      res.sendStatus(status);
    });
  }
}

@Controller('whatsapp-business-numbers')
export class WhatsAppSettingController {
  constructor(private readonly whatsappSettingService: WhatsappBusinessNumberService) {}

  @Post()
  create(@Body() createWhatsappSettingDto: CreateWhatsappBusinessNumberDto) {
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
  update(@Param('id') id: string, @Body() updateWhatsappSettingDto: UpdateWhatsappBusinessNumberDto) {
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
    return this.whatsappUserService.getOrCreate(createWhatsappUserDto);
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

@Controller('whatsapp-conversations')
export class WhatsappConversationController {
  constructor(private readonly whatsappConvService: WhatsappConversationService) {}

  @Post()
  getOrCreate(@Body() createWhatsappConversationDto: CreateWhatsappConversationDto) {
    return this.whatsappConvService.getOrCreate(createWhatsappConversationDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.whatsappConvService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.whatsappConvService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWhatsappConversationDto: UpdateWhatsappConversationDto) {
    return this.whatsappConvService.update(+id, updateWhatsappConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.whatsappConvService.remove(+id);
  }
}
