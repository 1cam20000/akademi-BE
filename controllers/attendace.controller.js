import { Router } from "express";
import { addAttendance, getAttendance } from "../services/Attendace.service.js";

//router object
const attendanceRoute = Router();

//routers
//--get all attendance
attendanceRoute.post("/get-attendances", getAttendance);
//--add new attendance
attendanceRoute.post("/add-attendances", addAttendance);

export default attendanceRoute;
