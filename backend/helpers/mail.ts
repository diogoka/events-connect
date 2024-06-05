import nodemailer from 'nodemailer';
import 'dotenv/config';

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
  const link = `${process.env.BACKEND_URL_CHECK + token}`;

  const mailOptions = {
    from: sender,
    to: email,
    subject: 'Email confirmation',
    html: `Press <a href="wwww.google.com/${link}">here</a> to verify your email. Thanks`,
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
