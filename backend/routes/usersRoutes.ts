import express, { Router } from 'express';
import {
  getUsers,
  getUser,
  createUser,
  editUser,
  matchStudentId,
  validateEmail,
  getStudentId,
} from '../controllers/usersControllers';

const usersRouter: Router = express.Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUser);
usersRouter.post('/', createUser);
usersRouter.put('/', editUser);
usersRouter.post('/checkStudentId', matchStudentId);
usersRouter.post('/getId', getStudentId);
usersRouter.post('/verify/:token', validateEmail);

export default usersRouter;
