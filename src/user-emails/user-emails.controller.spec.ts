import { Test, TestingModule } from '@nestjs/testing';
import { UserEmailsController } from './user-emails.controller';
import { UserEmailsService } from './user-emails.service';

describe('UserEmailsController', () => {
  let controller: UserEmailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserEmailsController],
      providers: [UserEmailsService],
    }).compile();

    controller = module.get<UserEmailsController>(UserEmailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
