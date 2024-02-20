import { sendEmail, EmailOption } from "../helpers/mail";
import pool from "../db/db";

const SPAN = ['3 day', '14 day'];

try {
  await pool.connect();

  const emailsResult = await pool.query('SELECT email_user FROM users');
  const emails: string[] = emailsResult.rows.map((row: any) => {
    return row.email_user;
  })

  const eventsResult = await pool.query(`
    SELECT
      *
    FROM
      events
    WHERE
      date_event_start >= NOW() + INTERVAL '${SPAN[0]}'
    AND
      date_event_start <= NOW() + INTERVAL '${SPAN[1]}';
    `);
  const eventDetails = eventsResult.rows.map((row: any) => {
    return `
      Date: ${row.date_event_start.toDateString()}
      Event Name: ${row.name_event}
    `;
  })

  const option: EmailOption = {
    to: emails,
    subject: `Unveiling Our Events!`,
    text: eventDetails.join('\n')
  }
  sendEmail(option, (error: any, info: any) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
    process.exit(0);
  });

} catch (error: any) {
  console.error(error);

  process.exit(1);
}
