import { BaseModel } from 'src/database/base.model';

export class VoipLogModel extends BaseModel {
  static tableName = 'voip_logs';

  call_id: string;
  remote_number: string;
  local_number: string;

  log: any;
}
