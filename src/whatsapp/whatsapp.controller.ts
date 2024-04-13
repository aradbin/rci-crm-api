import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from 'src/auth/public.decorators';
import { CreateWhatsappDto } from './dto/whatsapp.dto';
import { WebhookPayload } from './dto/whatsapp.webhook.dto';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) { }

  @Post()
  async create(@Req() req: any, @Body() createWhatsappDto: CreateWhatsappDto) {
    return await this.whatsappService.create(req?.user?.id, createWhatsappDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return await this.whatsappService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.whatsappService.findOne(id);
  }

  @Public()
  @Post('webhook')
  async webhookPost(@Body() payload: WebhookPayload) {
    console.log('Received this message from webhook:' + JSON.stringify(payload, null, 3));
    return await this.whatsappService.processWebhookEvent(payload);
  }

  @Public()
  @Get('webhook')
  webhook(@Req() req: Request, @Res() res: Response): void {console.log(req.query);
    const mode = req.query['hub.mode'] as string;
    const token = req.query['hub.verify_token'] as string;
    const challenge = req.query['hub.challenge'];

    this.whatsappService.verifyWebhook(mode, token).then((status) => {
      if (status === 200) {
        res.status(status).send(challenge);
      }
      res.sendStatus(status);
    });
  }
}
