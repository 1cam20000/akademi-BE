import { Router } from "express";
import {
  addSubject,
  deleteSubject,
  getSubject,
} from "../services/Subject.service.js";

//router object
const subjectRoute = Router();

//routers
//--get all subject
subjectRoute.post("/get-subjects", getSubject);
//--add new subject
subjectRoute.post("/add-subjects", addSubject);

subjectRoute.post("/delete-subjects", deleteSubject);

export default subjectRoute;
