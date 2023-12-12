import { Module } from '@nestjs/common';
import { VoipService } from './voip.service';
import { VoipController } from './voip.controller';

@Module({
  controllers: [VoipController],
  providers: [VoipService],
})
export class VoipModule {}
