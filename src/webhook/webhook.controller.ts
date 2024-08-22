import { Controller, Post, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('whatsapp')
  async whatsapp(@Body() payload: any) {
    return await this.webhookService.webhook('whatsapp', payload);
  }

  @Post('email')
  async email(@Body() payload: any) {
    return await this.webhookService.webhook('email', payload);
  }
}
