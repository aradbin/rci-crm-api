import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserMessageModel } from './user.model';
import { UserSettingsModule } from 'src/user-settings/user-settings.module';

@Module({
  imports: [UserSettingsModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
