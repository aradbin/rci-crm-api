import { Inject, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { ModelClass } from 'objection';
import { SettingsModel } from 'src/settings/settings.model';
import { UserSettingsService } from 'src/user-settings/user-settings.service';
import { CreateWhatsappConversationDto, CreateWhatsappDto } from './dto/whatsapp.dto';
import { Message, Metadata, SendMessagePayload, Status } from './dto/whatsapp.webhook.dto';
import { WhatsAppClient, WhatsappConfig } from './whatsapp.config';
import { WhatsappConversationModel, WhatsappMessageModel } from './whatsapp.models';

@Injectable()
export class WhatsappService {
  constructor(
    @Inject('WhatsappConversationModel') private conversationModelClass: ModelClass<WhatsappConversationModel>,
    @Inject('WhatsappMessageModel') private messageModelClass: ModelClass<WhatsappMessageModel>,
    @Inject('SettingsModel') private settingsModel: ModelClass<SettingsModel>,
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
      // return await this.messageModelClass.query().insert({
      //   conversation_id: conversation?.id,
      //   message_id: response.data.messages[0].id,
      //   message_body: createWhatsappDto.msg_body || createWhatsappDto.template_name,
      //   message_type: createWhatsappDto.message_type,
      //   context_message_id: createWhatsappDto.context_message_id,
      //   payload: payload,
      //   response: JSON.stringify(response.data),
      // });
    } catch (err) {
      throw new InternalServerErrorException(`Something went wrong. Please try again later`);
    }
  }

  async findAll(userId: number, params: any = {}) {
    let whatsappSettings = null;
    await this.userSettingsService.findAll({ user_id: userId }).then((response: any) => {
      response?.map((item: any) => {
        if (item?.settings?.type === 'whatsapp') {
          whatsappSettings = item?.settings
        }
      })
    })

    if (!whatsappSettings) {
      return [];
    }

    return await this.conversationModelClass.query()
      .where('settings_id', whatsappSettings?.id)
      .paginate(params)
      .filter(params)
      .orderBy('updated_at', 'desc')
      .where('deleted_at', null);
  }

  async findOne(id: number) {
    return await this.messageModelClass.query().where('conversation_id', id).paginate({}).withGraphFetched('user').find();
  }

  async getMedia(id: string) {
    try {
      const response = await axios.get(`https://graph.facebook.com/v19.0/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer EAAF24eooIeoBOyI0rbPbZBsxdMkksKP54iaFMGZBAZCS1EgNmOQiKHNGbu30uVUXZC9C9WsbZCEP4oW8emikOuOkQaD41s7Gs3KstjognIQvkTMhaD8C3f2MSggTM0Fk6ZACRdjPfVXE0ZBCaejvgQiZBJnXYXSZBPsnsatZBh6jXuQr0gb0D1gzGVX4lYaJFsT28JaRvnZBnwAOKDnMPX0o3UqfSMtr3vgGgZDZD`,
        },
      });
  
      const mediaResponse = await axios.get(response?.data?.url, {
        headers: {
          'Content-Type': response?.data?.mime_type,
          'Authorization': `Bearer EAAF24eooIeoBOyI0rbPbZBsxdMkksKP54iaFMGZBAZCS1EgNmOQiKHNGbu30uVUXZC9C9WsbZCEP4oW8emikOuOkQaD41s7Gs3KstjognIQvkTMhaD8C3f2MSggTM0Fk6ZACRdjPfVXE0ZBCaejvgQiZBJnXYXSZBPsnsatZBh6jXuQr0gb0D1gzGVX4lYaJFsT28JaRvnZBnwAOKDnMPX0o3UqfSMtr3vgGgZDZD`,
        },
        responseType: 'arraybuffer',
      });

      const imageBuffer = Buffer.from(mediaResponse.data, 'binary');
      const base64Image = imageBuffer.toString('base64');
      const dataUrl = `data:${mediaResponse.headers['content-type']};base64,${base64Image}`;

      return dataUrl;
    } catch (error) {
      throw error;
    }
  }

  async verifyWebhook(mode: string, token: string) {
    return mode === WhatsappConfig.WebhookMode && token === WhatsappConfig.WebhookVerifyKey ? 200 : 403;
  }

  async processWebhookEvent(payload: any) {

    console.log(JSON.stringify(payload, null, 3));
    if (payload?.object !== 'whatsapp_business_account'){
      throw new NotAcceptableException("");
    }
    for (const e of payload?.entry) {
      for (const change of e?.changes) {
        if (change?.field !== 'messages'){
          throw new NotAcceptableException("");
        };
        if (change?.value?.messages && change?.value?.metadata){
          const settigns = await this.settingsModel.query()
            .whereRaw("metadata->>'phone_number_id' = ?", change?.value?.metadata?.phone_number_id)
            .whereRaw("metadata->>'whatsapp_business_account_id' = ?", e?.id)
            .first();
          if(!settigns){
            throw new NotAcceptableException("");
          }
          let conversation = await this.conversationModelClass.query()
            .where('settings_id', settigns?.id)
            .whereLike('recipient_id', `%${change?.value?.contacts[0]?.wa_id}%`)
            .first();
          if(!conversation){
            const conversationDto = {
              settings_id: settigns?.id,
              recipient_id: change?.value?.contacts[0]?.wa_id
            }
            conversation = await this.conversationModelClass.query().insert(conversationDto)
          }
          for (const msg of change?.value?.messages){
            let newMsg = await this.messageModelClass.query().where('message_id', msg?.id).first();
            if(!newMsg){
              const message = {
                conversation_id: conversation?.id,
                message_id: msg?.id,
                payload: payload,
                status: "sent",
              };
              newMsg = await this.messageModelClass.query().insert(message);
            }

            return newMsg;
          }
        }
        // if (change?.value?.statuses) await this.processStatusEvent(change.value.statuses);
      }
    }

    return true;
  }

  private async processStatusEvent(statuses: Status[]) {
    // for (const status of statuses) {
    //   const isUpdated = await this.messageModelClass.query().patch({ message_status: status.status }).where({ message_id: status.id });
    //   if (!isUpdated) {
    //     throw new NotFoundException(`Message with id ${status.id} not found`);
    //   }
    // }
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
