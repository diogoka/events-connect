import pool from '../db/db';
import express from 'express';

export const getAllTags = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const tags = await pool.query(
      'SELECT * FROM tags ORDER BY tags.name_tag ASC'
    );
    res.status(200).json(tags.rows);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
