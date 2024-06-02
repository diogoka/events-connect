import { addingCourse } from './../models/courseModels';
import express from 'express';
import { UserInput } from '../types/types';
import {
  getAllUsers,
  createUserModel,
  getUserById,
  updateUserModel,
  checkId,
} from '../models/userModels';
import { updateCourse } from '../models/courseModels';
import { validateUserInput } from '../helpers/validateUser';

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
    res.status(200).json(user);
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
    const updatedUser = await updateUserModel(userInput);

    // Add user's course to DB
    const updatedCourse = await updateCourse(userInput);

    const user = await getUserById(userInput.id);

    console.log('updatedUser', updatedUser);

    console.log('user', user);

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
    const newUser = await createUserModel(userInput);
    // Add user's course to DB
    const newUserCourse = await addingCourse(userInput);
    const userRes = { ...newUser, ...newUserCourse };
    res.status(200).json(userRes);
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
