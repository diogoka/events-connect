import { Request } from 'express';
import multer from 'multer';

declare module 'express-serve-static-core' {
  interface Request {
    file: multer.Multer.File;
  }
}
