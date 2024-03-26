import { Module } from '@nestjs/common';
import { VoipService } from './voip.service';
import { VoipController } from './voip.controller';
import { SocketModule } from 'src/socket/socket.module';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [SocketModule, TaskModule],
  controllers: [VoipController],
  providers: [VoipService],
})
export class VoipModule { }
