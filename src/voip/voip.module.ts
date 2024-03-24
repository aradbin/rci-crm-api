import { Module } from '@nestjs/common';
import { VoipService } from './voip.service';
import { VoipController } from './voip.controller';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [SocketModule],
  controllers: [VoipController],
  providers: [VoipService],
})
export class VoipModule { }
