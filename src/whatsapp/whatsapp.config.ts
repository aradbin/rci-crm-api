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
  AccessToken: string;
  PhoneNumberID: string;
  WebhookMode: string;
  WebhookVerifyKey: string;
}

export const WhatsappConfig: WhatsappConfig = {
  ProductName: 'whatsapp',
  BaseUrl: 'https://graph.facebook.com/v17.0',
  PhoneNumberID: '131343013387719',
  WebhookVerifyKey: 'Happy',
  WebhookMode: 'subscribe',
  AccessToken:
    'EAAyZALRyQHK8BOZBQK6obKPy6f85KgVtWTZAprdSmnYBIYpmyKuw8I0uQL2abRcWiab2jXjjZAcPXABVLAVuLKdMnxky0lyygjL0m0fqi4d4Tfx7iArahLbeTOoM0GIvhLLeJf4n6SQgCmOFmpCDTCUza2MjDfDAmboj2mIjzZANk162ZAkSCTngHrVTD2ZBZAK57fSUitTkapCmenWzbDFSFs8yz3OF23JIlwZDZD',
};

export const WhatsAppClient = axios.create({
  baseURL: WhatsappConfig.BaseUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${WhatsappConfig.AccessToken}`,
  },
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
});
