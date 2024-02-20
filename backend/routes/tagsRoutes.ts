import express, { Router } from "express";
import { getAllTags } from "../controllers/tagsControllers";


const tagsRouter: Router = express.Router();

tagsRouter.get("/", getAllTags);

export default tagsRouter;