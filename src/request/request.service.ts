import { Injectable } from '@nestjs/common';
import { UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RequestService {
  async create(payload: any) {
    const options = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'X-API-KEY': process.env.UNIPILE_API_KEY
      },
      body: JSON.stringify({
        ...payload?.body,
        api_url: process.env.UNIPILE_BASE_URL       
      })
    };

    const response = await fetch(`${process.env.UNIPILE_BASE_URL}${payload?.url}`, options)
      .then(res => res.json())
      .then(res => res)
      .catch(err => console.error(err));

    return response;
  }

  async get(payload: any) {
    const options = {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'X-API-KEY': process.env.UNIPILE_API_KEY
      },
    };
    
    const response = await fetch(`${process.env.UNIPILE_BASE_URL}${payload?.url}`, options)
      .then(res => res.json())
      .then(res => res)
      .catch(err => console.error(err));

    return response;
  }

  update(id: number, updateRequestDto: UpdateRequestDto) {
    return `This action updates a #${id} request`;
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }

  getTomorrowDate() {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const year = tomorrow.getFullYear();
    let month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    let day = String(tomorrow.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}T00:00:00.000Z`;
  }
}
