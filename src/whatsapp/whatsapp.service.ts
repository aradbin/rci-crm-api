import { Inject, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ModelClass } from 'objection';
import { WhatsappConversationModel, WhatsappMessageModel } from './whatsapp.models';
import { CreateWhatsappConversationDto, CreateWhatsappDto } from './dto/whatsapp.dto';
import { UserSettingsService } from 'src/user-settings/user-settings.service';
import { Message, Metadata, SendMessagePayload, Status, WebhookPayload } from './dto/whatsapp.webhook.dto';
import { WhatsAppClient, WhatsappConfig } from './whatsapp.config';

@Injectable()
export class WhatsappService {
  constructor(
    @Inject('WhatsappConversationModel') private conversationModelClass: ModelClass<WhatsappConversationModel>,
    @Inject('WhatsappMessageModel') private messageModelClass: ModelClass<WhatsappMessageModel>,
    private userSettingsService: UserSettingsService,
  ) { }

  async create(userId: number, createWhatsappDto: CreateWhatsappDto) {
    let wbn = null;

    await this.userSettingsService.findAll({ user_id: userId }).then((response: any) => {
      response?.results?.map((item: any) => {
        if (item?.settings?.type === 'whatsapp' && item?.settings?.metadata?.phone_number === createWhatsappDto?.sender_number) {
          wbn = item?.settings
        }
      })
    })

    if (!wbn) {
      throw new NotFoundException(`${createWhatsappDto.sender_number} is not assigned to your account`);
    }

    let conversation = await this.conversationModelClass.query().where('sender_number', createWhatsappDto?.sender_number).where('recipient_number', createWhatsappDto?.recipient_number).find().first()

    if (!conversation) {
      const createWhatsappConversationDto: CreateWhatsappConversationDto = {
        sender_number: createWhatsappDto.sender_number,
        recipient_number: createWhatsappDto.recipient_number,
        created_at: null,
        created_by: null
      }
      conversation = await this.conversationModelClass.query().insert(createWhatsappConversationDto)
    }

    if (!conversation) {
      throw new NotFoundException(`No conversation found between ${createWhatsappDto.sender_number} and ${createWhatsappDto.recipient_number}`);
    }

    const url = `/${wbn?.metadata?.phone_number_id}/messages`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${wbn?.metadata?.access_token}`,
    };
    const payload = this.buildSendMessagePayload(createWhatsappDto);
    try {
      const response = await WhatsAppClient.post(url, payload, { headers });
      return await this.messageModelClass.query().insert({
        conversation_id: conversation?.id,
        message_id: response.data.messages[0].id,
        message_body: createWhatsappDto.msg_body || createWhatsappDto.template_name,
        message_type: createWhatsappDto.message_type,
        context_message_id: createWhatsappDto.context_message_id,
        payload: payload,
        response: JSON.stringify(response.data),
      });
    } catch (err) {
      throw new InternalServerErrorException(`Something went wrong. Please try again later`);
    }
  }

  async findAll(params: any = {}) {
    return await this.conversationModelClass.query().paginate(params).filter(params).withGraphFetched('customer').find();
  }

  async findOne(id: number) {
    return await this.messageModelClass.query().where('conversation_id', id).paginate({}).withGraphFetched('user').find();
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
      // await this.messageModelClass.query().insert({
      //   message_id: msg.id,
      //   message_type: msg.type,
      //   sender_number: msg.from,
      //   message_status: 'received',
      //   message_body: msg.text.body,
      //   payload: JSON.stringify(msg),
      //   recipient_number: metadata.display_phone_number,
      //   context_message_id: msg.context ? msg.context.id : null,
      // });
    }
  }

  private buildSendMessagePayload(payload: CreateWhatsappDto) {
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
