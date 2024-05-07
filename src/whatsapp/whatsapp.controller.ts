import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, Res, UnprocessableEntityException } from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from 'src/auth/public.decorators';
import { CreateWhatsappDto } from './dto/whatsapp.dto';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) { }

  @Post()
  async create(@Req() req: any, @Body() createWhatsappDto: CreateWhatsappDto) {
    return await this.whatsappService.create(req?.user?.id, createWhatsappDto);
  }

  @Get()
  async findAll(@Req() req: any, @Query() query: any) {
    return await this.whatsappService.findAll(req?.user?.id, query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.whatsappService.findOne(id);
  }

  @Get('media/:id')
  async getMedia(@Param('id') id: string) {
    return await this.whatsappService.getMedia(id);
  }

  @Public()
  @Post('api/webhook')
  async webhookPost(@Body() payload: any, @Res() response: Response) {
    try {
      await this.whatsappService.processWebhookEvent(payload);
      return response.sendStatus(200);
    } catch (error) {
      throw new UnprocessableEntityException("Something went wrong. Please try again");
    }
  }

  @Public()
  @Get('api/webhook')
  webhook(@Req() req: Request, @Res() res: Response): void {
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
