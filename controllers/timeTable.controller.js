import { Router } from "express";
import {
  addTimeTable,
  deleteTimeTable,
  getAllTimeTables,
  getTimeTableByClass,
  updateTimeTable,
} from "../services/TimeTable.service.js";
import { validateAdminToken } from "../middlewares/validateAdminToken.js";

//router object
const timetableRoute = Router();

//routers
//--get all timetable
timetableRoute.post(
  "/get-all-timetables",
  getAllTimeTables
);

//--get timetable by class id
timetableRoute.post(
  "/get-timetables-by-class",
  getTimeTableByClass
);

//--add new subject
timetableRoute.post("/add-timetables", validateAdminToken, addTimeTable);

//--add new subject
timetableRoute.post("/update-timetables", validateAdminToken, updateTimeTable);

timetableRoute.post("/delete-timetables", validateAdminToken, deleteTimeTable);

export default timetableRoute;
