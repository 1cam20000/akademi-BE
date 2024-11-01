import { Router } from "express";
import {
  addSubject,
  deleteSubject,
  getSubject,
} from "../services/Subject.service.js";
import { validateAdminToken } from "../middlewares/validateAdminToken.js";

//router object
const subjectRoute = Router();

//routers
//--get all subject
subjectRoute.post("/get-subjects", validateAdminToken, getSubject);
//--add new subject
subjectRoute.post("/add-subjects", validateAdminToken, addSubject);
//--delete subject
subjectRoute.post("/delete-subjects", validateAdminToken, deleteSubject);

export default subjectRoute;
