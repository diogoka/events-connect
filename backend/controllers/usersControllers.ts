import { addingCourse } from './../models/courseModels';
import express from 'express';
import { UserInput } from '../types/types';
import {
  getAllUsers,
  createUserModel,
  getUserById,
  updateUserModel,
  checkId,
  isUserVerifiedModel,
  verifyUserModel,
} from '../models/userModels';
import { updateCourse } from '../models/courseModels';
import { validateUserInput } from '../helpers/validateUser';
import { sendEmail, sendConfirmationEmail } from '../helpers/mail';
import { generateToken, checkToken } from '../helpers/tokenHandler';

export const getUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users.rows);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export const getUser = async (req: express.Request, res: express.Response) => {
  const userId = req.params.id;

  try {
    const user = await getUserById(userId);
    if (user) {
      if (!user?.is_verified) {
        return res.status(401).send('Email is not verified.');
      } else {
        res.status(200).json(user);
      }
    } else {
      res.status(401).json('You need to finish the registration.');
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
    // Update User
    const updatedUser = await updateUserModel(userInput);

    // Update Course
    const updatedCourse = await updateCourse(userInput);

    const fullUpdated = { ...updatedUser, ...updatedCourse };

    res.status(200).json(fullUpdated);
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
    await createUserModel(userInput);
    await addingCourse(userInput);
    const token = generateToken(userInput.id, userInput.email);

    await sendConfirmationEmail(userInput.email, token);

    res.status(200).send('User Created.');
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export const matchStudentId = async (
  req: express.Request,
  res: express.Response
) => {
  const { email, studentId } = req.body;
  const checked = await checkId(email, studentId);
  res.status(200).json(checked);
};

export const validateEmail = async (
  req: express.Request,
  res: express.Response
) => {
  const { token } = req.params;

  const tokenValidation = checkToken(token);

  if (tokenValidation.valid) {
    const isUserVerified = await isUserVerifiedModel(
      tokenValidation.payload.email
    );

    if (isUserVerified.verified) {
      res.status(400).json(`${isUserVerified.message}`);
    } else {
      const isBeingVerified = await verifyUserModel(tokenValidation.payload);
      res
        .status(200)
        .json(`${isBeingVerified.message} You can close this window now.`);
    }
  } else {
    if (tokenValidation.message === 'jwt expired') {
      const tokenInfo = tokenValidation!.payload!;
      const isVerified = await isUserVerifiedModel(tokenInfo.id);

      if (isVerified.verified) {
        res.status(400).json('User already verified.');
      } else {
        const newToken = generateToken(tokenInfo.id, tokenInfo.email);
        await sendConfirmationEmail(tokenInfo.email, newToken);
        res
          .status(400)
          .json('Token expired. A new one was generated. Check your email.');
      }
    } else {
      res.status(401).json('Invalid Token.');
    }
  }
};
