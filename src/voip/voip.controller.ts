import { Controller, Get, Patch, Param, Query, UnprocessableEntityException, ParseIntPipe, Body } from '@nestjs/common';
import { VoipService } from './voip.service';
import { Public } from 'src/auth/public.decorators';
import { UpdateVoipDto } from './dto/update-voip.dto';

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

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateVoipDto: UpdateVoipDto) {
    try {
      return await this.voipService.update(id, updateVoipDto);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
