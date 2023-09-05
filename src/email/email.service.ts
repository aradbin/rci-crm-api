import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import * as nodemailer from 'nodemailer';
import { inspect } from 'util';
const Imap = require('node-imap');
const { simpleParser } = require('mailparser');

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

    let email_array = [];

    imap.once('ready', () => {
      try {
        imap.openBox('INBOX', false, function (err, box) {
          imap.search([ 'ALL' ], function(err, results) {
            if(!results || !results.length){
              console.log("The server didn't find any emails matching the specified criteria")
              imap.end();
              return;   
            }    
    
            var fetch = imap.fetch(results, {
              bodies: '',
              struct: true
            })
        
            fetch.on('message', function(msg, seqno) {
              console.log('Message #%d', seqno);
              var prefix = '(#' + seqno + ') ';
              msg.on('body', function(stream, info) {
                //Retrieve the 'from' header and buffer the entire body of the newest message:
                if (info.which === 'TEXT')
              
                var buffer = '', count = 0;
        
                stream.on('data', async function(chunk) {
                  count += chunk.length;
                  buffer += chunk.toString('utf8');
                });
    
                stream.once('end', async function() {
                  let attach = null
                  //console.log((await simpleParser(buffer))) -> to see entire data of email
                  
                  if(((await simpleParser(buffer)).attachments).length != 0) {
                    attach = (await simpleParser(buffer)).attachments[0].content //to get attachments
                  }
                  
                  if (info.which !== 'TEXT'){
                    let dataheader = Imap.parseHeader(buffer)

                    let emails_data = {
                      "date": dataheader.date[0],
                      "subject": dataheader.subject[0],
                      "from": dataheader.from[0],
                      "to": dataheader.to[0],
                      "content": (await simpleParser(buffer)).text, 
                      "attachment": attach
                    }
                    
                    email_array.push(emails_data)
                  }
                  else{
                    console.log(prefix + 'Body [%s] Finished', inspect(info.which));
                  }
                });
              });
    
              //mark attributes email as read
              // msg.once('attributes', function(attrs) {
              //   let uid = attrs.uid;
              //   imap.addFlags(uid, ['\\Seen'], function (err) {
              //       if (err) {
              //           console.log(err);
              //       } else {
              //           console.log("Done, marked email as read!")
              //       }
              //   });
              // });

              msg.once('end', function() {
                console.log(prefix + 'Finished');
              });
            });
    
            fetch.once('error', function(err) {
              console.log('Fetch error: ' + err);
            });
        
            fetch.once('end', function() {
              console.log('Done fetching all messages!');
              imap.end();
            });
          })
        });
      } catch (error) {
        console.log("Error when request open inbox mail",error)
      }
    });
    
    imap.once('error', function(err) {
      console.log("Error when connection to IMAP", err);
    });
    
    imap.once('close', function() {
      console.log('Connection ended');
    });
    
    imap.connect();

    return new Promise((resolve, reject) => {
      imap.once('close', async function () { //maybe, someone asking whether to use end or close and the author of the module says that close is always emitted so you should use that.
        resolve(email_array);
      });
    })
  }
}
