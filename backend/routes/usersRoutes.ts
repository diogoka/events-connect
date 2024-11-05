import express, { Router } from 'express';
import {
  getUsers,
  getUser,
  createUser,
  editUser,
  matchStudentId,
  validateEmail,
  resendValidationEmail,
} from '../controllers/usersControllers';

const usersRouter: Router = express.Router();

usersRouter.post('/resendVerifyEmail', resendValidationEmail);
usersRouter.post('/checkStudentId', matchStudentId);
usersRouter.post('/verify/:token', validateEmail);
usersRouter.post('/:id', getUser);
usersRouter.get('/', getUsers);
usersRouter.post('/', createUser);
usersRouter.put('/', editUser);

export default usersRouter;
