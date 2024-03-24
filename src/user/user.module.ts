import { Module } from '@nestjs/common';
import { MinioService } from 'src/minio/minio.service';
import { UserSettingsModule } from 'src/user-settings/user-settings.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UserSettingsModule],
  controllers: [UserController],
  providers: [UserService, MinioService],
  exports: [UserService],
})
export class UserModule {}
