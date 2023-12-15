import { Controller, Get, Query } from '@nestjs/common';
import { VoipService } from './voip.service';
import { Public } from 'src/auth/public.decorators';

@Controller('voip')
export class VoipController {
  constructor(private readonly voipService: VoipService) { }

  @Get('/create')
  @Public()
  create(@Query() params: any) {
    return this.voipService.create(params);
  }

  @Get('/list')
  findAll(@Query() params: any) {
    return this.voipService.findAll(params);
  }
}
