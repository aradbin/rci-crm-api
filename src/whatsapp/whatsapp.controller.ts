import { Controller, Get, Post, Body, Req, Res, Query } from '@nestjs/common';
import { Request, Response } from 'express';
import { WhatsappMessageService } from './whatsapp.message.service';

import {
  CreateWhatsappConversationDto,
  SendTextMessageDto,
  UpdateWhatsappConversationDto,
} from './dto/whatsapp.dto';
import { WebhookPayload } from './dto/whatsapp.webhook.dto';
import { Public } from 'src/auth/public.decorators';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappMessageService: WhatsappMessageService) { }

  @Get()
  findAll(@Query() query: any) {
    return this.whatsappMessageService.findAll(query);
  }


  @Post('send-message')
  async sendMessage(@Req() req: any, @Body() payload: SendTextMessageDto, @Res() res: Response) {
    const message = await this.whatsappMessageService.sendMessage(req?.user?.id, payload);
    res.status(200).json(message);
  }

  @Public()
  @Post('webhook')
  async webhookPost(@Body() payload: WebhookPayload) {
    console.log('Received this message from webhook:' + JSON.stringify(payload, null, 3));
    return await this.whatsappMessageService.processWebhookEvent(payload);
  }

  @Public()
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

// @Controller('whatsapp-conversations')
// export class WhatsappConversationController {
//   constructor(private readonly whatsappConvService: WhatsappConversationService) {}

//   @Post()
//   getOrCreate(@Body() createWhatsappConversationDto: CreateWhatsappConversationDto) {
//     return this.whatsappConvService.getOrCreate(createWhatsappConversationDto);
//   }

//   @Get()
//   findAll(@Query() query: any) {
//     return this.whatsappConvService.findAll(query);
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.whatsappConvService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateWhatsappConversationDto: UpdateWhatsappConversationDto) {
//     return this.whatsappConvService.update(+id, updateWhatsappConversationDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.whatsappConvService.remove(+id);
//   }
// }
