import app from './app';
import pool from './db/db';

import 'dotenv/config';

const bootstrap = async () => {
  try {
    await pool.connect().then(() => {
      console.log('[database]: connected.');
    });
  } catch (error) {
    console.log('[database]: connection failed: ', error);
  }
  app.listen(process.env.PORT, () => {
    console.log('[server]: running ⚡️');
  });
};

bootstrap();
