import { ModelClass } from 'objection';
import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { SendTextMessageDto } from './dto/whatsapp.dto';
import { WhatsAppClient, WhatsappConfig } from './whatsapp.config';
import { WhatsappMessageModel, WhatsappBusinessNumberModel, WhatsappUserModel, WhatsappConversationModel } from './whatsapp.models';
import { Message, Metadata, Status, WebhookPayload } from './dto/whatsapp.webhook.dto';
import { CustomerModel } from 'src/customer/customer.model';

@Injectable()
export class WhatsappMessageService {
  constructor(
    @Inject('WhatsappUserModel') private userModelClass: ModelClass<WhatsappUserModel>,
    @Inject('CustomerModel') private customerModelClass: ModelClass<CustomerModel>,
    @Inject('WhatsappMessageModel') private messageModelClass: ModelClass<WhatsappMessageModel>,
    @Inject('WhatsappConversationModel') private conversationModelClass: ModelClass<WhatsappConversationModel>,
    @Inject('WhatsappBusinessNumberModel') private WbnModelClass: ModelClass<WhatsappBusinessNumberModel>,
  ) {}

  async sendMessage(sendMessageDto: SendTextMessageDto) {
    const conversation = (await this.conversationModelClass
      .query()
      .findById(sendMessageDto.conversation_id)
      .withGraphFetched('customer')
      .withGraphFetched('whatsapp_business_number')
      .find()) as any;

    if (!conversation) {
      throw new NotFoundException(`Conversation with id ${sendMessageDto.conversation_id} not found`);
    }

    const wbn = conversation.whatsapp_business_number as WhatsappBusinessNumberModel;
    const url = `/${wbn.phone_number_id}/messages`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${wbn.access_token}`,
    };
    const payload = this.buildSendMessagePayload(sendMessageDto);

    try {
      const response = await WhatsAppClient.post(url, payload, { headers });
      const message = await this.messageModelClass
        .query()
        .insert({
          payload: payload,
          user_id: sendMessageDto.user_id,
          response: JSON.stringify(response.data),
          message_id: response.data.messages[0].id,
          message_type: sendMessageDto.message_type,
          conversation_id: sendMessageDto.conversation_id,
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

  async processWebhookEvent(payload: WebhookPayload) {
    if (payload.object !== 'whatsapp_business_account') return;
    for (const e of payload.entry) {
      for (const change of e.changes) {
        if (change.field !== 'messages') return;
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
      const customer = await this.customerModelClass.query().find().where({ contact: msg.from }).find().first();
      if (!customer) {
        throw new NotFoundException(`Customer with contact ${msg.from} not found`);
      }

      const wbn = await this.WbnModelClass.query().where({ phone_number_id: metadata.phone_number_id }).find().first();
      if (!wbn) {
        throw new NotFoundException(`Whatsapp business number with id ${metadata.phone_number_id} not found`);
      }

      const conversation = await this.conversationModelClass
        .query()
        .where({ customer_id: customer.id, whatsapp_business_number_id: wbn.id })
        .find()
        .first();
      if (!conversation) {
        throw new NotFoundException(`Conversation with customer id ${customer.id} and whatsapp business number id ${wbn.id} not found`);
      }

      await this.messageModelClass.query().insert({
        message_id: msg.id,
        message_type: msg.type,
        message_status: 'received',
        message_body: msg.text.body,
        payload: JSON.stringify(msg),
        conversation_id: conversation.id,
        context_message_id: msg.context ? msg.context.id : null,
      });
    }
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
