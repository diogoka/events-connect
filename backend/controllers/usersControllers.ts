import pool from '../db/db';
import express from 'express';

type UserInput = {
  id: string;
  type: number;
  courseId: number;
  firstName: string;
  lastName: string;
  email: string;
  postalCode: string;
  phone: string;
  provider: string;
  avatarURL: string;
};

type UserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  provider: string;
  avatarURL: string | null;
  roleId: number;
  roleName: string;
  postalCode: string | null;
  courseId: number;
  courseName: string;
};

export const getUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await pool.query('SELECT * FROM users');
    res.status(200).json(users.rows);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export const getUser = async (req: express.Request, res: express.Response) => {
  const userId = req.params.id;

  try {
    const user = await getUserResponse(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(500).send('Failed to get user');
    }
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export const editUser = async (req: express.Request, res: express.Response) => {
  const userInput: UserInput = req.body;

  const { result, message } = validateUserInput(userInput);
  if (!result) {
    res.status(500).send(message);
    return;
  }

  try {
    // Add a new user to DB
    await pool.query(
      `
            UPDATE
                users
            SET
                id_user_type = $1, first_name_user = $2, last_name_user = $3, email_user = $4, postal_code_user = $5, phone_user = $6, avatar_url = $7
            WHERE
                id_user = $8
            RETURNING
                *;
            `,
      [
        userInput.type,
        userInput.firstName,
        userInput.lastName,
        userInput.email,
        userInput.postalCode,
        userInput.phone,
        userInput.avatarURL,
        userInput.id,
      ]
    );

    // Add user's course to DB
    await pool.query(
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

    const user = await getUserResponse(userInput.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(500).send('Failed to edit user');
    }
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export const createUser = async (
  req: express.Request,
  res: express.Response
) => {
  const userInput: UserInput = req.body;
  const { result, message } = validateUserInput(userInput);
  if (!result) {
    res.status(500).send(message);
    return;
  }

  try {
    // Add a new user to DB
    await pool.query(
      `
            INSERT INTO
                users (id_user, id_user_type, first_name_user, last_name_user, email_user, postal_code_user, phone_user, avatar_url, provider)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING
                *;
            `,
      [
        userInput.id,
        userInput.type,
        userInput.firstName,
        userInput.lastName,
        userInput.email,
        userInput.postalCode,
        userInput.phone,
        userInput.avatarURL,
        userInput.provider,
      ]
    );

    // Add user's course to DB
    await pool.query(
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

    const user = await getUserResponse(userInput.id);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

function validateUserInput(userInput: UserInput): {
  result: boolean;
  message: string;
} {
  let result = false;
  let message = '';

  if (!userInput.id) {
    message = 'Invalid user ID';
  } else if (isNaN(userInput.type)) {
    message = 'Invalid User Type';
  } else if (isNaN(userInput.courseId)) {
    message = 'Invalid Course ID';
  } else if (!/^[^@]+@[^.]+\..+$/.test(userInput.email)) {
    message = 'Invalid Email';
  } else if (
    userInput.postalCode &&
    !/^[A-Za-z0-9]{3}[-\s]?[A-Za-z0-9]{3}$/.test(userInput.postalCode)
  ) {
    message = 'Invalid Postal Code';
  } else if (userInput.phone && !/^[0-9-]+$/.test(userInput.phone)) {
    message = 'Invalid Phone Number';
  } else {
    result = true;
  }

  return {
    result,
    message,
  };
}

async function getUserResponse(userId: string) {
  try {
    const userResult = await pool.query(
      `
        SELECT
            users.id_user AS id,
            users.id_user_type AS role_id,
            users_type.role_user AS role_name,
            users.first_name_user AS first_name,
            users.last_name_user AS last_name,
            users.email_user AS email,
            users.postal_code_user AS postal_code,
            users.phone_user AS phone,
            users.provider AS provider,
            users.avatar_url AS avatar_url
        FROM
            users
        JOIN
            users_type ON users.id_user_type = users_type.id_user_type
        WHERE
            users.id_user = $1
        `,
      [userId]
    );

    const user: UserResponse = {
      id: userResult.rows[0].id,
      roleId: userResult.rows[0].role_id,
      roleName: userResult.rows[0].role_name,
      firstName: userResult.rows[0].first_name,
      lastName: userResult.rows[0].last_name,
      email: userResult.rows[0].email,
      postalCode: userResult.rows[0].postal_code,
      phone: userResult.rows[0].phone,
      provider: userResult.rows[0].provider,
      avatarURL: userResult.rows[0].avatar_url,
      courseId: 0,
      courseName: '',
    };

    if (!user) {
      return null;
    }

    const courseResult = await pool.query(
      `
        SELECT
            courses.id_course AS course_id,
            courses.name_course AS course_name
        FROM
            users_courses
        JOIN
            courses ON users_courses.id_course = courses.id_course
        WHERE
            users_courses.id_user = $1
        `,
      [userId]
    );

    user.courseId = courseResult.rows[0].course_id;
    user.courseName = courseResult.rows[0].course_name;

    return user;
  } catch (err: any) {
    console.error(err);
    return null;
  }
}
