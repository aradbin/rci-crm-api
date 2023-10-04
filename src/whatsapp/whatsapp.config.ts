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
  PhoneNumberID: '136917759493885',
  WebhookVerifyKey: 'Happy',
  WebhookMode: 'subscribe',
  AccessToken:
    'EAAVMh66ruJQBOxEsldGkLxiM1T4UHoZCBlGhTecQaeRsgZAIzMjOM2iNtpR1QVMqRaEuhLzkuVDT8egZANyRuJqETDNUwX7ZAvKDPvlZCfHVJSraTxqBzedBkbmxw29fRJC0P33LOmXFQV0BRc4uQZB71E789E5CXYsNDiws1RRV2ecKt3NmUZBgFgruU8BTSXb5o78R7usyj2B3AKv',
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
