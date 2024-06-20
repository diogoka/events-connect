import nodemailer from 'nodemailer';
import 'dotenv/config';
import { generateEmail } from './mailHTML';

export type EmailOption = {
  to: string[];
  subject: string;
  text: string;
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'eventllege.info@gmail.com',
    pass: process.env.MAIL_PASSWORD,
  },
});

const defaultCallBack = (error: any, info: any) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
};

export const sendEmail = (option: EmailOption, cb = defaultCallBack) => {
  const mailOptions = {
    from: 'eventllege.info@gmail.com',
    to: option.to,
    subject: option.subject,
    text: option.text,
  };

  transporter.sendMail(mailOptions, cb);
  return;
};

export const sendConfirmationEmail = async (email: string, token: string) => {
  const sender = 'Cornerstone Connect';
  const link = `${process.env.FRONTEND_URL + token}`;

  const emailHTML = await generateEmail(link);

  const mailOptions = {
    from: sender,
    to: email,
    subject: 'Email Verification',
    html: emailHTML,
  };
  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log('Error: ', error);
    } else {
      console.log(`Confirmation email sent to ${email}`);
    }
  });
  return;
};
