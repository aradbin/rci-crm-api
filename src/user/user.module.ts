import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserMessageModel } from './user.model';

@Module({
  controllers: [UserController],
  providers: [UserService, { provide: 'UserMessageModel', useValue: UserMessageModel }],
  exports: [UserService],
})
export class UserModule {}
