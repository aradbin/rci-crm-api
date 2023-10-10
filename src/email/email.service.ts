import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import * as nodemailer from 'nodemailer';
import { EmailSettingsService } from 'src/email-settings/email-settings.service';
const Imap = require('node-imap');
const { simpleParser } = require('mailparser');

@Injectable()
export class EmailService {
  constructor(private emailSettingsService: EmailSettingsService) { }

  async create(userId: number, createEmailDto: CreateEmailDto) {
    const emailSettings = await this.emailSettingsService.findByUserId(userId);

    if (!emailSettings) {
      throw new UnprocessableEntityException("Email config not found. Please config your email");
    }

    const decryptedData = this.emailSettingsService.decryptPassword(emailSettings?.password);

    // Create a transporter
    const transporter = nodemailer.createTransport({
      // service: 'Gmail',
      host: emailSettings?.host,
      port: 465,
      secure: true,
      auth: {
        user: emailSettings?.username,
        pass: decryptedData,
      },
    });

    // Define email options
    const mailOptions = {
      from: {
        name: emailSettings?.name,
        address: emailSettings?.username
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

  async find() {
    const imap = new Imap({
      user: "aradbin@asrexpress.com",
      password: "5Z41FqeddeA$",
      host: "asrexpress.com",
      port: 993,
      tls: true,
    });

    let email_array = [];

    imap.once('ready', () => {
      try {
        imap.openBox('INBOX', false, (err, box) => {
          if (err) throw err;

          // Search for unseen emails
          const searchCriteria = ['UNSEEN'];
          imap.search(searchCriteria, (searchError, results) => {
            if (searchError) throw searchError;

            // Fetch email bodies and headers
            const fetch = imap.fetch(results, {
              bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
              struct: true
            });

            fetch.on('message', (msg, seqno) => {
              const emailData = {
                attr: '',
                header: '',
                text: '',
                html: ''
              };

              msg.on('attributes', (attrs) => {
                // The UID can be accessed as attrs.uid
                emailData.attr = attrs;
              });

              msg.on('body', (stream, info) => {
                let buffer = '';
                stream.on('data', (chunk) => {
                  buffer += chunk.toString('utf8');
                });

                stream.on('end', () => {
                  if (info.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)') {
                    emailData.header = Imap.parseHeader(buffer);
                  } else if (info.which === 'TEXT') {
                    // emailData.text = buffer;
                  } else if (info.which === 'HTML') {
                    // emailData.html = buffer;
                  } else {
                    console.error('Invalid or unsupported section:', info.which);
                  }
                });
              });

              msg.on('end', () => {
                console.log('Email Data:', emailData);
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

    imap.once('error', function (err) {
      console.log("Error when connection to IMAP", err);
    });

    imap.once('error', (err) => {
      console.error('IMAP error:', err);
    });

    imap.connect();

    return new Promise((resolve, reject) => {
      imap.once('close', async function () { //maybe, someone asking whether to use end or close and the author of the module says that close is always emitted so you should use that.
        resolve(email_array);
      });
    })
  }
}
