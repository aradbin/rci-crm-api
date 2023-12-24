import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import * as nodemailer from 'nodemailer';
import { UserSettingsService } from 'src/user-settings/user-settings.service';
import { simpleParser } from 'mailparser';
const Imap = require('node-imap');

@Injectable()
export class EmailService {
  constructor(private userSettingsService: UserSettingsService) { }

  async create(userId: number, createEmailDto: CreateEmailDto) {
    const emailSettings = await this.getEmailSettings(userId);

    // Create a transporter
    const transporter = nodemailer.createTransport({
      // service: 'Gmail',
      host: emailSettings?.metadata?.host,
      port: 465,
      secure: true,
      auth: {
        user: emailSettings?.metadata?.username,
        pass: emailSettings?.metadata?.password,
      },
    });

    // Define email options
    const mailOptions = {
      from: {
        name: emailSettings?.name,
        address: emailSettings?.metadata?.username
      },
      to: createEmailDto.toEmail,
      subject: createEmailDto.subject,
      text: createEmailDto.text,
      html: createEmailDto.html,
    };

    // Send the email
    try {
      return await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new UnprocessableEntityException("Something went wrong. Please try again later")
    }
  }

  async findAll(userId: number, query: any) {
    const emailSettings = await this.getEmailSettings(userId);

    const imap = new Imap({
      user: emailSettings?.metadata?.username,
      password: emailSettings?.metadata?.password,
      host: emailSettings?.metadata?.host,
      port: 993,
      tls: true,
    });

    const fetchOptions = {
      bodies: '',
      markSeen: false,
      struct: true,
    };

    const pagination = (query?.page && query?.pageSize) ?
      `${((query?.page - 1) * query?.pageSize) + 1}:${query?.page * query?.pageSize}`
      :
      '1:10'

    let email_array = [];
    let total = 0;

    imap.once('ready', () => {
      try {
        imap.openBox('INBOX', true, (err: any, box: any) => {
          if (err) throw err;

          total = box.messages.total;
          const fetch = imap.seq.fetch(pagination, fetchOptions);

          fetch.on('message', (msg: any) => {
            msg.on('body', (stream: any, info: any) => {
              simpleParser(stream, {}).then((parsed: any) => {
                email_array.push(parsed);
              }).catch((error: any) => {
                console.log(error);
              });
            })
          })

          fetch.once('end', () => {
            imap.end();
          });
        });
      } catch (error) {
        throw error;
      }
    });

    imap.once('error', function (error: any) {
      throw error;
    });

    imap.connect();

    return new Promise((resolve, reject) => {
      imap.once('close', async function () {
        resolve({ results: email_array, total });
      });
    })
  }

  async getEmailSettings(userId: number) {
    let emailSettings = null;
    await this.userSettingsService.findAll({ user_id: userId, deleted_at: null }).then((response: any) => {
      response?.results?.map((item: any) => {
        if (item?.settings?.type === 'email') {
          emailSettings = item?.settings
        }
      })
    });

    if (!emailSettings) {
      throw new UnprocessableEntityException("Email config not found. Please config your email");
    }

    const decryptedData = this.userSettingsService.decryptPassword(emailSettings?.metadata?.password);

    return {
      ...emailSettings,
      metadata: {
        ...emailSettings.metadata,
        password: decryptedData
      }
    }
  }
}
