import pool from '../db/db';
import express from 'express';
import { getAllCourses, getCourseCategory } from '../models/courseModels';

export const getCourses = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const courses = await getAllCourses();
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
    const courseCategory = await getCourseCategory();
    res.status(200).json(courseCategory.rows);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
