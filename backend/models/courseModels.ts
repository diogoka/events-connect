import pool from '../db/db';
import { UserInput } from '../types/types';

export const updateCourse = async (userInput: UserInput) => {
  const updatedCourse = await pool.query(
    `
            UPDATE
                users_courses
            SET
                id_course = $1
            WHERE
                id_user = $2
            RETURNING
                *;
        `,
    [userInput.courseId, userInput.id]
  );
};

export const addingCourse = async (userInput: UserInput) => {
  const newCourse = await pool.query(
    `
            INSERT INTO
                users_courses (id_user, id_course)
            VALUES
                ($1, $2)
            RETURNING
                *;
        `,
    [userInput.id, userInput.courseId]
  );
};

export const getAllCourses = async () => {
  const allCourses = await pool.query(
    'SELECT * FROM courses ORDER BY category_course ASC'
  );
  return allCourses;
};

export const getCourseCategory = async () => {
  const courseCategory = await pool.query(
    'SELECT DISTINCT courses.category_course FROM courses ORDER BY category_course ASC'
  );
  return courseCategory;
};
