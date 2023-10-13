export interface WebhookPayload {
  object: string;
  entry: Entry[];
}

export interface Entry {
  id: string;
  changes: Change[];
}

export interface Change {
  value: Value;
  field: string;
}

export interface Value {
  messaging_product: string;
  metadata: Metadata;
  contacts: Contact[] | null;
  messages: Message[] | null;
  statuses: Status[] | null;
}

export interface Metadata {
  display_phone_number: string;
  phone_number_id: string;
}

export interface Contact {
  profile: Profile;
  wa_id: string;
}

export interface Profile {
  name: string;
}

export interface Message {
  context: Context | null;
  from: string;
  id: string;
  timestamp: string;
  text: Text;
  type: string;
}

export interface Context {
  from: string;
  id: string;
}

export interface Text {
  body: string;
}

export interface Status {
  id: string;
  status: string;
  timestamp: string;
  recipient_id: string;
}

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
