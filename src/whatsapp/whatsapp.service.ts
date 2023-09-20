import { Injectable } from '@nestjs/common';
import {
  SendMessagePayload,
  SendMessageResponse,
  WhatsAppClient,
  WhatsappConfig,
} from './whatsapp.config';
import { SendTextMessageDto } from './dto/whatsapp.dto';

@Injectable()
export class WhatsappService {
  async sendMessage(payload: SendTextMessageDto) {
    const url = `/${WhatsappConfig.PhoneNumberID}/messages`;

    const messagePayload: SendMessagePayload =
      this.buildSendMessagePayload(payload);

    const data = JSON.stringify(messagePayload);

    console.log(messagePayload);

    try {
      const response = await WhatsAppClient.post(url, data);
      if (response.status === 200) {
        return response.data as SendMessageResponse;
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        throw new Error(
          `Failed to send message: ${err.response?.data} (status ${status})`,
        );
      } else {
        throw new Error(`Failed to send message: ${err.message}`);
      }
    }
  }

  async verifyWebhook(mode: string, token: string) {
    return mode === WhatsappConfig.WebhookMode &&
      token === WhatsappConfig.WebhookVerifyKey
      ? 200
      : 403;
  }

  private buildSendMessagePayload(
    payload: SendTextMessageDto,
  ): SendMessagePayload {
    return {
      to: payload.to,
      type: payload.message_type,
      messaging_product: WhatsappConfig.ProductName,
      recipient_type: 'individual',
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
    };
  }
}
