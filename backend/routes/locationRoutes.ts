import express, { Router } from 'express';
import { getLocation } from '../controllers/locationControllers';

const locationRouter: Router = express.Router();

locationRouter.get('/', getLocation);

export default locationRouter;