import express, { Router } from 'express';
import { getUsers, getUser, createUser, editUser } from '../controllers/usersControllers';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req: express.Request, file: Express.Multer.File, cb) {
    cb(null, 'public/img/users')
  },
  
  filename: function (req: express.Request, file: Express.Multer.File, cb) {
    const ext = path.extname(file.originalname);
    const fileName = req.body.id + ext;
    cb(null, fileName)
  }
})
export const upload = multer({ storage: storage })

const usersRouter: Router = express.Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUser);
usersRouter.post('/', upload.single('avatar'), createUser);
usersRouter.put('/', upload.single('avatar'), editUser);

export default usersRouter;