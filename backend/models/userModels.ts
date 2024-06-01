import pool from '../db/db';
import { UserInput, UserResponse } from '../types/types';

export const getAllUsers = async () => {
  const allUsers = await pool.query('SELECT * FROM users');
  return allUsers;
};

export const createUserModel = async (userInput: UserInput) => {
  await pool.query(
    `
            INSERT INTO
                users (id_user, id_user_type, first_name_user, last_name_user, email_user, postal_code_user, phone_user, avatar_url, provider, is_verified)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
      userInput.is_verified,
    ]
  );
};

export const updateUserModel = async (userInput: UserInput) => {
  await pool.query(
    `
            UPDATE
                users
            SET
                id_user_type = $1, first_name_user = $2, last_name_user = $3, email_user = $4, postal_code_user = $5, phone_user = $6, avatar_url = $7, is_verified = $8
            WHERE
                id_user = $9
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
      userInput.is_verified,
      userInput.id,
    ]
  );
};

export const getUserById = async (userId: string) => {
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
            users.avatar_url AS avatar_url,
            users.is_verified AS is_verified
        FROM
            users
        JOIN
            users_type ON users.id_user_type = users_type.id_user_type
        WHERE
            users.id_user = $1
        `,
      [userId]
    );

    if (userResult.rows[0]) {
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
        is_verified: userResult.rows[0].is_verified,
      };
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
    } else {
      return null;
    }
  } catch (err: any) {
    console.error(err);
    return null;
  }
};
