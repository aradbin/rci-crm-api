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
