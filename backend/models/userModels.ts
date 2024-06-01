import pool from '../db/db';

export const getAllUsers = async () => {
  const allUsers = await pool.query('SELECT * FROM users');
  return allUsers;
};
