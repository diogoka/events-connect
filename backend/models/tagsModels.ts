import pool from '../db/db';

export const getAllTagsASCOrder = async () => {
  const tags = await pool.query(
    'SELECT * FROM tags ORDER BY tags.name_tag ASC'
  );
  return tags;
};
