import { BaseModel } from "src/database/base.model";

export class EmailModel extends BaseModel {
  static tableName = 'emails';

  settings_id: number;
  email: string;
  email_id: string;
  email_data: any;
}