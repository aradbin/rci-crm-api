import { BaseModel } from 'src/database/base.model';

export class CustomerModel extends BaseModel {
  static tableName = 'customers';

  name: string;
  email?: string;
  address?: string;
  country_code?: string;
  contact?: string;
  verified: boolean;
}
