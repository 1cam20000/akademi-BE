import { Router } from "express";
import { addAttendance, getAttendance } from "../services/Attendace.service.js";
import { validateTeacherToken } from "../middlewares/validateTeacherToken.js";

//router object
const attendanceRoute = Router();

//routers
//--get all attendance
attendanceRoute.post("/get-attendances", validateTeacherToken, getAttendance);
//--add new attendance
attendanceRoute.post("/add-attendances", validateTeacherToken, addAttendance);

export default attendanceRoute;
