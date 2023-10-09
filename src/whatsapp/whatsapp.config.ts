import axios from 'axios';

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
