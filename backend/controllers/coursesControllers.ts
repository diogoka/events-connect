import pool from '../db/db';
import express from 'express';

export const getCourses = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const courses = await pool.query(
      'SELECT * FROM courses ORDER BY category_course ASC'
    );
    const resData = courses.rows.map((row: any) => {
      return {
        id: row.id_course,
        name: row.name_course,
        category: row.category_course,
      };
    });
    res.status(200).json(resData);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export const getCategories = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const courseCategory = await pool.query(
      'SELECT DISTINCT courses.category_course FROM courses ORDER BY category_course ASC'
    );
    res.status(200).json(courseCategory.rows);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
