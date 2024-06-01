import express, { Router } from 'express';
import {
  getUsers,
  getUser,
  createUser,
  editUser,
  matchStudentId,
} from '../controllers/usersControllers';

const usersRouter: Router = express.Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUser);
usersRouter.post('/', createUser);
usersRouter.put('/', editUser);
usersRouter.post('/checkStudentId', matchStudentId);

export default usersRouter;
