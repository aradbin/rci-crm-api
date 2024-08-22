import { Injectable } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { RequestService } from 'src/request/request.service';

@Injectable()
export class AccountService {
  constructor(
    private requestService: RequestService
  ) {}
  async create(createAccountDto: any) {
    const response = await this.requestService.create({
      url: '/hosted/accounts/link',
      body: {
        type: 'create',
        providers: [createAccountDto?.provider],
        expiresOn: this.requestService.getTomorrowDate(),
        name: 'Test',
      }
    });

    return response?.url;
  }

  async findAll() {
    const response = await this.requestService.get({
      url: '/accounts'
    });

    return response;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
