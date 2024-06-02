import { Module } from '@nestjs/common';
import { SocketModule } from 'src/socket/socket.module';
import { TaskModule } from 'src/task/task.module';
import { PhoneController } from './phone.controller';
import { PhoneService } from './phone.service';

@Module({
  imports: [SocketModule, TaskModule],
  controllers: [PhoneController],
  providers: [PhoneService],
})
export class PhoneModule {}
