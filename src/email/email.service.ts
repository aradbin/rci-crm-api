import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { simpleParser } from 'mailparser';
import * as nodemailer from 'nodemailer';
import { ModelClass } from 'objection';
import { UserSettingsService } from 'src/user-settings/user-settings.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { EmailModel } from './email.model';
const Imap = require('node-imap');

@Injectable()
export class EmailService {
  constructor(
    @Inject('EmailModel') private modelClass: ModelClass<EmailModel>,
    private userSettingsService: UserSettingsService
  ) { }

  async create(userId: number, createEmailDto: CreateEmailDto) {
    const emailSettings = await this.getEmailSettings(userId);

    // Create a transporter
    const transporter = nodemailer.createTransport({
      // service: 'Gmail',
      host: emailSettings?.metadata?.smtp,
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
      return await transporter.sendMail(mailOptions).then(async () => {
        await this.modelClass.query().insert({
          settings_id: emailSettings?.id,
          email: createEmailDto.toEmail,
          email_id: null,
          email_data: {
            from: {
              html: "",
              text: `${emailSettings?.name} <${emailSettings?.metadata?.username}>`,
              value: [{
                name: emailSettings?.name,
                address: emailSettings?.metadata?.username
              }]
            },
            to: {
              html: "",
              text: createEmailDto.toEmail,
              value: [{
                name: "",
                address: createEmailDto.toEmail
              }]
            },
            subject: createEmailDto.subject,
            html: createEmailDto.html || false,
            textAsHtml: createEmailDto.text,
            text: createEmailDto.text,
            date: new Date()
          },
        });
      });
    } catch (error) {
      throw new UnprocessableEntityException("Something went wrong. Please try again later")
    }
  }

  async findAll(params: any = {}) {
    return await this.modelClass.query().paginate(params).filter(params).find();
  }

  async findOne(id: number) {
    return await this.modelClass.query().findById(id).find();
  }

  async sync(userId: number, query: any) {
    const emailSettings = await this.getEmailSettings(userId);

    const imap = new Imap({
      user: emailSettings?.metadata?.username,
      password: emailSettings?.metadata?.password,
      host: emailSettings?.metadata?.imap,
      port: 993,
      tls: true,
    });

    const fetchOptions = {
      bodies: '',
      markSeen: false,
      struct: true,
    };

    let email_array = [];
    let total = 0;

    imap.once('ready', () => {
      try {
        imap.openBox('INBOX', true, async (err, box) => {
          if (err) throw err;
  
          total = box.messages.total;
          // const pageSize = query?.pageSize ? parseInt(query.pageSize, 10) : 10;
          // const page = query?.page ? parseInt(query.page, 10) : 1;
          // const paginationStart = (page - 1) * pageSize + 1;
          // const paginationEnd = page * pageSize;
          // const pagination = paginationStart <= total ? `${paginationStart}:${Math.min(paginationEnd, total)}` : '1:10';
          const pagination = `1:${total}`;
  
          const fetch = imap.seq.fetch(pagination, fetchOptions);
  
          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, {}).then(async (parsed) => {
                email_array.push(parsed);
                let emailId = "";
                parsed?.headerLines?.map((item) => {
                  if(item?.key === 'message-id'){
                    emailId = item?.line
                  }
                });
                const hasEmail = await this.modelClass.query().filter({ email_id: emailId }).find().first();
                if(!hasEmail){
                  await this.modelClass.query().insert({
                    settings_id: emailSettings?.id,
                    email: parsed?.from?.value[0]?.address,
                    email_id: emailId,
                    email_data: parsed
                  });
                }else{
                  await this.modelClass.query().where('email_id',emailId).update({
                    email_data: parsed
                  });
                }
              }).catch((error) => {
                console.error(error);
                imap.end();
              });
            });
          });
  
          fetch.once('end', () => {
            imap.end();
          });
        });
      } catch (error) {
        console.error(error);
        imap.end();
      }
    });
  
    imap.once('error', (error) => {
      console.error(error);
      imap.end();
    });
  
    imap.connect();
  
    return new Promise((resolve) => {
      imap.once('close', () => {
        resolve({ results: email_array, total });
      });
    });
  }

  async getFolders(emailSettings) {
    const imap = new Imap({
      user: emailSettings?.username,
      password: emailSettings?.password,
      host: emailSettings?.imap,
      port: 993,
      tls: true,
    });
  
    return new Promise((resolve, reject) => {
      imap.once('ready', () => {
        try {
          imap.getBoxes(async (err, boxes) => {
            if (err) {
              imap.end();
              reject(err);
              return;
            }
  
            const folders = await this.imapNestedFolders(boxes);
            imap.end();
            resolve(folders);
          });
        } catch (error) {
          imap.end();
          reject(error);
        }
      });
  
      imap.once('error', (error) => {
        imap.end();
        reject(error);
      });
  
      imap.connect();
    });
  }
  
  async imapNestedFolders(boxes) {
    const folders = [];
    for (const key in boxes) {
      if (boxes[key].attribs.indexOf('\\HasChildren') > -1) {
        const children = await this.imapNestedFolders(boxes[key].children);
        folders.push({ name: key, children });
      } else {
        folders.push({ name: key, children: null });
      }
    }
    return folders;
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
