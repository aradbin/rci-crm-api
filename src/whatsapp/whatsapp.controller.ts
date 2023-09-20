import { Controller, Get, Post, Body, Req, Res } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { Request, Response } from 'express';
import { SendTextMessageDto } from './dto/whatsapp.dto';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('send-message')
  async sendMessage(@Body() payload: SendTextMessageDto, @Res() res: Response) {
    // the function only returns response, throws an error
    const message = await this.whatsappService.sendMessage(payload);

    res.status(200).json(message);
  }

  @Post('webhook')
  webhookPost(@Req() req: Request, @Res() res: Response) {
    // process the message
    console.log(
      'Received this message from webhook:' + JSON.stringify(req.body, null, 3),
    );
    res.status(200).json({ message: 'Thank you for the message' });
  }

  @Get('webhook')
  webhook(@Req() req: Request, @Res() res: Response): void {
    // Parse the query params
    const mode = req.query['hub.mode'] as string;
    const token = req.query['hub.verify_token'] as string;
    const challenge = req.query['hub.challenge'];

    this.whatsappService.verifyWebhook(mode, token).then((status) => {
      if (status === 200) {
        res.status(status).send(challenge);
      }
      // return the error status
      res.sendStatus(status);
    });
  }
}
