import nodemailer from 'nodemailer';

export type EmailOption = {
  to: string[];
  subject: string;
  text: string;
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'eventllege.info@gmail.com',
    pass: process.env.MAIL_PASSWORD
  }
});

const defaultCallBack = (error: any, info: any) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}

export const sendEmail = (option: EmailOption, cb = defaultCallBack) => {

  const mailOptions = {
    from: 'eventllege.info@gmail.com',
    to: option.to,
    subject: option.subject,
    text: option.text
  };

  transporter.sendMail(mailOptions, cb);
  return;
}