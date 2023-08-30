import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import * as nodemailer from 'nodemailer';
const Imap = require('node-imap');

@Injectable()
export class EmailService {
  async create(createEmailDto: CreateEmailDto) {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      // service: 'Gmail',
      host: "asrexpress.com",
      port: 465,
      secure: true,
      auth: {
        user: 'aradbin@asrexpress.com',
        pass: '5Z41FqeddeA$',
      },
    });

    // Define email options
    const mailOptions = {
      from: 'aradbin@asrexpress.com',
      to: createEmailDto.toEmail,
      subject: createEmailDto.subject,
      text: createEmailDto.text,
      html: createEmailDto.html
    };

    // Send the email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
    
    return 'This action adds a new email';
  }

  async find() {
    const imap = new Imap({
      user: 'aradbin@asrexpress.com',
      password: '5Z41FqeddeA$',
      host: 'asrexpress.com',
      port: 993,
      tls: true,
    });

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) throw err;
    
        // Search for unseen emails
        const searchCriteria = ['UNSEEN'];
        imap.search(searchCriteria, (searchError, results) => {
          if (searchError) throw searchError;
    
          // Fetch email bodies and headers
          const fetch = imap.fetch(results, {
            bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT']
          });
    
          fetch.on('message', (msg, seqno) => {
            const emailData = {
              header: '',
              text: '',
              html: ''
            };
    
            msg.on('body', (stream, info) => {
              let buffer = '';
              stream.on('data', (chunk) => {
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
              console.log('Email Data:', emailData);
            });
          });
    
          fetch.once('end', () => {
            imap.end();
          });
        });
      });
    });
    
    imap.once('error', (err) => {
      console.error('IMAP error:', err);
    });
    
    imap.connect();

    return `This action returns all email`;
  }
}
