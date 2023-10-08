import axios from 'axios';

export interface SendMessagePayload {
  to: string;
  type: string;
  template: Template | null;
  text: Text | null;
  messaging_product: string;
  recipient_type: string;
}

export interface Text {
  preview_url: boolean;
  body: string;
}

export interface Template {
  name: string;
  language: Language;
}

export interface Language {
  code: string;
}

export interface SendMessageResponse {
  messaging_product: string;
  contacts: Contact[];
  messages: Message[];
}

export interface Contact {
  input: string;
  wa_id: string;
}

export interface Message {
  id: string;
}

interface WhatsappConfig {
  BaseUrl: string;
  ProductName: string;
  WebhookMode: string;
  WebhookVerifyKey: string;
}

export const WhatsappConfig: WhatsappConfig = {
  ProductName: 'whatsapp',
  BaseUrl: 'https://graph.facebook.com/v17.0',
  WebhookVerifyKey: 'Happy',
  WebhookMode: 'subscribe',
};

export const WhatsAppClient = axios.create({
  baseURL: WhatsappConfig.BaseUrl,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
});
