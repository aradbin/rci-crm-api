import { ModelClass } from 'objection';
import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { UserModel } from 'src/user/user.model';
import { SendTextMessageDto } from './dto/whatsapp.dto';
import { WhatsAppClient, WhatsappConfig } from './whatsapp.config';
import { WhatsappMessageModel, WhatsappBusinessNumberModel, WhatsappUserModel } from './whatsapp.models';

@Injectable()
export class WhatsappMessageService {
  constructor(
    @Inject('WhatsappUserModel') private userModelClass: ModelClass<WhatsappUserModel>,
    @Inject('WhatsappMessageModel') private messageModelClass: ModelClass<WhatsappMessageModel>,
    @Inject('WhatsappBusinessNumberModel') private settingModelClass: ModelClass<WhatsappBusinessNumberModel>,
  ) {}

  async sendMessage(sendMessageDto: SendTextMessageDto) {
    const whatsappUser = (await this.userModelClass
      .query()
      .findById(sendMessageDto.whatsapp_user_id)
      .withGraphFetched('whatsapp_setting')
      .withGraphFetched('user')
      .find()) as any;

    if (!whatsappUser) {
      throw new NotFoundException(`User with id ${sendMessageDto.whatsapp_user_id} not found`);
    }

    const settings = whatsappUser.whatsapp_setting as WhatsappBusinessNumberModel;
    const url = `/${settings.phone_number_id}/messages`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.access_token}`,
    };
    const payload = this.buildSendMessagePayload(sendMessageDto);

    try {
      const response = await WhatsAppClient.post(url, payload, { headers });
      const message = await this.messageModelClass
        .query()
        .insert({
          payload: payload,
          receiver_id: sendMessageDto.customer_id,
          message_id: response.data.messages[0].id,
          message_type: sendMessageDto.message_type,
          sender_id: sendMessageDto.whatsapp_user_id,
          response: JSON.stringify(response.data),
          context_message_id: sendMessageDto.context_message_id,
          message_body: sendMessageDto.msg_body || sendMessageDto.template_name,
        })
        .returning('*');

      return { message: 'message sent successfully' };
    } catch (err) {
      throw new InternalServerErrorException(`failed to send message to customer, please try again later}`);
    }
  }

  async verifyWebhook(mode: string, token: string) {
    return mode === WhatsappConfig.WebhookMode && token === WhatsappConfig.WebhookVerifyKey ? 200 : 403;
  }

  private buildSendMessagePayload(payload: SendTextMessageDto) {
    return JSON.stringify({
      to: payload.customer_number,
      type: payload.message_type,
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
