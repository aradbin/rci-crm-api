import { ModelClass } from 'objection';
import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { SendTextMessageDto } from './dto/whatsapp.dto';
import { WhatsAppClient, WhatsappConfig } from './whatsapp.config';
import { WhatsappMessageModel } from './whatsapp.models';
import { Message, Metadata, SendMessagePayload, Status, WebhookPayload } from './dto/whatsapp.webhook.dto';
import { UserSettingsService } from 'src/user-settings/user-settings.service';

@Injectable()
export class WhatsappMessageService {
  constructor(
    @Inject('WhatsappMessageModel') private messageModelClass: ModelClass<WhatsappMessageModel>,
    private userSettingsService: UserSettingsService
  ) { }

  async findAll(params: any = {}) {
    var numbers = [params.number_one, params.number_two];
    delete params.number_one;
    delete params.number_two;
    return await this.messageModelClass
      .query()
      .whereIn('sender_number', numbers)
      .whereIn('recipient_number', numbers)
      .sort(params)
      .paginate(params)
      .find();
  }

  async sendMessage(userId: number, sendMessageDto: SendTextMessageDto) {
    let wbn = null;

    await this.userSettingsService.findAll({ user_id: userId, deleted_at: null }).then((response: any) => {
      response?.results?.map((item: any) => {
        if (item?.settings?.type === 'whatsapp') {
          wbn = item?.settings
        }
      })
    })

    if (!wbn) {
      throw new NotFoundException(`WhatsApp Business number with ${sendMessageDto.sender_number} not found`);
    }

    const url = `/${wbn?.metadata?.phone_number_id}/messages`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${wbn?.metadata?.access_token}`,
    };
    const payload = this.buildSendMessagePayload(sendMessageDto);

    try {
      const response = await WhatsAppClient.post(url, payload, { headers });
      const message = await this.messageModelClass
        .query()
        .insert({
          payload: payload,
          response: JSON.stringify(response.data),
          message_id: response.data.messages[0].id,
          message_type: sendMessageDto.message_type,
          sender_number: sendMessageDto.sender_number,
          recipient_number: sendMessageDto.recipient_number,
          context_message_id: sendMessageDto.context_message_id,
          message_body: sendMessageDto.msg_body || sendMessageDto.template_name,
        })
        .returning('*');

      return { message: 'message sent successfully' };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(`Something went wrong. Please try again later`);
    }
  }

  async verifyWebhook(mode: string, token: string) {
    return mode === WhatsappConfig.WebhookMode && token === WhatsappConfig.WebhookVerifyKey ? 200 : 403;
  }

  async processWebhookEvent(payload: WebhookPayload) {
    const FIELD_NAME = 'messages';
    const WBA = 'whatsapp_business_account';

    if (payload.object !== WBA) return;
    for (const e of payload.entry) {
      for (const change of e.changes) {
        if (change.field !== FIELD_NAME) return;
        if (change.value.messages) await this.processMessageEvent(change.value.metadata, change.value.messages);
        if (change.value.statuses) await this.processStatusEvent(change.value.statuses);
      }
    }
  }

  private async processStatusEvent(statuses: Status[]) {
    for (const status of statuses) {
      const isUpdated = await this.messageModelClass.query().patch({ message_status: status.status }).where({ message_id: status.id });
      if (!isUpdated) {
        throw new NotFoundException(`Message with id ${status.id} not found`);
      }
    }
  }

  private async processMessageEvent(metadata: Metadata, messages: Message[]) {
    for (const msg of messages) {
      await this.messageModelClass.query().insert({
        message_id: msg.id,
        message_type: msg.type,
        sender_number: msg.from,
        message_status: 'received',
        message_body: msg.text.body,
        payload: JSON.stringify(msg),
        recipient_number: metadata.display_phone_number,
        context_message_id: msg.context ? msg.context.id : null,
      });
    }
  }

  private buildSendMessagePayload(payload: SendTextMessageDto) {
    return JSON.stringify(<SendMessagePayload>{
      type: payload.message_type,
      to: payload.recipient_number,
      messaging_product: WhatsappConfig.ProductName,
      recipient_type: 'individual',
      context: {
        message_id: payload.context_message_id,
      },
      template:
        payload.message_type === 'template'
          ? {
            name: payload.template_name,
            language: {
              code: 'en_US',
            },
          }
          : null,
      text:
        payload.message_type === 'text'
          ? {
            preview_url: true,
            body: payload.msg_body,
          }
          : null,
    });
  }
}
