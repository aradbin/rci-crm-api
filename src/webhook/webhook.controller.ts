import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/auth/public.decorators';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Public()
  @Post('whatsapp')
  async whatsapp(@Body() payload: any) {
    console.log('webhook.controller',payload);
    return await this.webhookService.webhook('whatsapp', payload);
  }

  @Public()
  @Post('email')
  async email(@Body() payload: any) {
    return await this.webhookService.webhook('email', payload);
  }
}
