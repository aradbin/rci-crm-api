import { Controller, Get, Query } from '@nestjs/common';
import { VoipService } from './voip.service';
import { Public } from 'src/auth/public.decorators';

@Controller('voip')
export class VoipController {
  constructor(private readonly voipService: VoipService) {}

  // @Post()
  // create(@Body() createVoipDto: CreateVoipDto) {
  //   return this.voipService.create(createVoipDto);
  // }

  @Get('/log')
  @Public()
  hook(@Query() params: any) {
    return this.voipService.hook(params);
  }

  @Get('/log/list')
  @Public()
  findAll(@Query() params: any) {
    return this.voipService.findAll(params);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.voipService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVoipDto: UpdateVoipDto) {
  //   return this.voipService.update(+id, updateVoipDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.voipService.remove(+id);
  // }
}
