import express, { Router } from "express";
import { getCourses, getCategories } from "../controllers/coursesControllers";

const coursesRouter: Router = express.Router();

coursesRouter.get("/", getCourses);
coursesRouter.get("/category", getCategories);

export default coursesRouter;
