import { Module } from '@nestjs/common';
import { SocketModule } from 'src/socket/socket.module';
import { TaskModule } from 'src/task/task.module';
import { CallController } from './call.controller';
import { CallService } from './call.service';

@Module({
  imports: [SocketModule, TaskModule],
  controllers: [CallController],
  providers: [CallService],
})
export class CallModule {}
