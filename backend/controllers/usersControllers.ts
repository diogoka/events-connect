import { addingCourse } from './../models/courseModels';
import express from 'express';
import { UserInput } from '../types/types';
import { getAllUsers, updateUser, getUserResponse } from '../models/userModels';
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
    const user = await getUserResponse(userId);
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
    await updateUser(userInput);

    // Add user's course to DB
    await updateCourse(userInput);

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

  console.log('UserInput', userInput);

  const { result, message } = validateUserInput(userInput);
  console.log('result', result);

  if (!result) {
    res.status(500).send(message);
    return;
  }

  try {
    // Add a new user to DB
    await updateUser(userInput);

    // Add user's course to DB
    await addingCourse(userInput);

    const user = await getUserResponse(userInput.id);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
