import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UpdateWhatsappDto } from './dto/update-whatsapp.dto';
import { AccountService } from 'src/account/account.service';
import { RequestService } from 'src/request/request.service';

@Injectable()
export class WhatsappService {
  constructor(
    private accountService: AccountService,
    private requestService: RequestService
  ) {}

  async create(createWhatsappDto: any) {
    const accounts = await this.accountService.findAll();
    const whatsapp = accounts?.items?.find((account: any) => (account?.type === 'WHATSAPP' && account?.name === createWhatsappDto?.sender_number));
    if(!whatsapp) {
      throw new UnprocessableEntityException('Account not found');
    }

    const response = !createWhatsappDto?.conversation_id ?
      await this.requestService.create({
        url: `/chats`,
        body: {
          attendees_ids: `${createWhatsappDto?.recipient_number}@s.whatsapp.net`,
          account_id: whatsapp?.id,
          text: createWhatsappDto?.text,
        }
      })
    :
      await this.requestService.create({
        url: `/chats/${createWhatsappDto?.conversation_id}/messages`,
        body: {
          text: createWhatsappDto?.text,
        }
      });

    return response;
  }

  async findAll(query: any) {
    if(!query?.account){
      return {}
    }

    const accounts = await this.accountService.findAll();
    const whatsapp = accounts?.items?.find((account: any) => (account?.type === 'WHATSAPP' && account?.name === query?.account));
    if(!whatsapp) {
      return {};
    }

    const payload = {
      account_id: whatsapp?.id,
      limit: query?.pageSize || 100,
    }

    const param = new URLSearchParams(payload).toString()

    const response = await this.requestService.get({
      url: `/chats?${param}`
    })

    return response
  }

  async findOne(id: any) {
    const response = await this.requestService.get({
      url: `/chats/${id}/messages`
    })

    return response;
  }

  update(id: number, updateWhatsappDto: UpdateWhatsappDto) {
    return `This action updates a #${id} whatsapp`;
  }

  remove(id: number) {
    return `This action removes a #${id} whatsapp`;
  }
}
