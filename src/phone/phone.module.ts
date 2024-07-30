import { Module } from '@nestjs/common';
import { SettingsModule } from 'src/settings/settings.module';
import { SocketModule } from 'src/socket/socket.module';
import { TaskModule } from 'src/task/task.module';
import { PhoneController } from './phone.controller';
import { PhoneService } from './phone.service';

@Module({
  imports: [SocketModule, TaskModule, SettingsModule],
  controllers: [PhoneController],
  providers: [PhoneService],
})
export class PhoneModule {}
