import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import * as nodemailer from 'nodemailer';
import { UserSettingsService } from 'src/user-settings/user-settings.service';
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

  async find(userId: number) {
    const emailSettings = await this.getEmailSettings(userId);

    const imap = new Imap({
      user: emailSettings?.metadata?.username,
      password: emailSettings?.metadata?.password,
      host: emailSettings?.metadata?.host,
      port: 993,
      tls: true,
    });

    let email_array = [];

    imap.once('ready', () => {
      try {
        imap.openBox('INBOX', false, (err: any, box: any) => {
          if (err) throw err;

          // Search for unseen emails
          const searchCriteria = ['UNSEEN'];
          imap.search(searchCriteria, (searchError: any, results: any) => {
            if (searchError) throw searchError;

            // Fetch email bodies and headers
            const fetch = imap.fetch(results, {
              bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
              struct: true
            });

            fetch.on('message', (msg: any, seqno: any) => {
              const emailData = {
                attr: null,
                header: null,
                text: null,
                html: null
              };

              msg.on('attributes', (attrs: any) => {
                // The UID can be accessed as attrs.uid
                emailData.attr = attrs;
              });

              msg.on('body', (stream: any, info: any) => {
                let buffer = '';
                stream.on('data', (chunk: any) => {
                  buffer += chunk.toString('utf8');
                });

                stream.on('end', () => {
                  if (info.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)') {
                    emailData.header = Imap.parseHeader(buffer);
                  } else if (info.which === 'TEXT') {
                    emailData.text = buffer;
                  } else if (info.which === 'HTML') {
                    emailData.html = buffer;
                  } else {
                    console.error('Invalid or unsupported section:', info.which);
                  }
                });
              });

              msg.on('end', () => {
                console.log('Email Data:', emailData.attr.uid);
                email_array.push(emailData);
              });
            });

            fetch.once('end', () => {
              imap.end();
            });
          });
        })
      } catch (error) {
        console.log("Error when request open inbox mail", error)
      }
    });

    imap.once('error', function (err: any) {
      console.log("Error when connection to IMAP", err);
    });

    imap.connect();

    return new Promise((resolve, reject) => {
      imap.once('close', async function () { //maybe, someone asking whether to use end or close and the author of the module says that close is always emitted so you should use that.
        resolve(email_array);
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
