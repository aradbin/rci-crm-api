import { Controller, Get, Query, UnprocessableEntityException } from '@nestjs/common';
import { VoipService } from './voip.service';
import { Public } from 'src/auth/public.decorators';

@Controller('voip')
export class VoipController {
  constructor(private readonly voipService: VoipService) { }

  @Get('create')
  @Public()
  async create(@Query() params: any) {
    try {
      return await this.voipService.create(params);
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  @Get('list')
  findAll(@Query() params: any) {
    return this.voipService.findAll(params);
  }
}
