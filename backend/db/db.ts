import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + '?sslmode=require',
});

export default pool;
