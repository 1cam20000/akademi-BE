import { Router } from "express";
import {
  addTimeTable,
  deleteTimeTable,
  getAllTimeTables,
  getTimeTableByClass,
  updateTimeTable,
} from "../services/TimeTable.service";

//router object
const timetableRoute = Router();

//routers
//--get all timetable
timetableRoute.post("/get-all-timetables", getAllTimeTables);

//--get timetable by class id
timetableRoute.post("/get-timetables-by-class", getTimeTableByClass);

//--add new subject
timetableRoute.post("/add-timetables", addTimeTable);

//--add new subject
timetableRoute.post("/update-timetables", updateTimeTable);

timetableRoute.post("/delete-timetables", deleteTimeTable);

export default timetableRoute;
