import express from "express";
import { connectMongodb } from "./database/connectMongodb.js";
import { corsMiddleware } from "./middlewares/corsOption.js";
import dotenv from "dotenv";
import { studentRouter } from "./controllers/student.controller.js";
import { adminRouter } from "./controllers/admin.controller.js";
import { teacherRouter } from "./controllers/teacher.controller.js";
import attendanceRoute from "./controllers/attendace.controller.js";
import subjectRoute from "./controllers/subject.controller.js";
import timetableRoute from "./controllers/timeTable.controller.js";

//

const app = express();

//

app.use(express.json());
app.use(corsMiddleware);
dotenv.config();
connectMongodb();
app.use("/student", studentRouter);
app.use("/admin", adminRouter);
app.use("/teacher", teacherRouter);
app.use("/attendace", attendanceRoute);
app.use("/subject", subjectRoute);
app.use("/time-table", timetableRoute);

//
const port = 8888;
app.listen(
  port,
  console.log(`🚀 ~ PORT:${port}; running at http://localhost:${port} `)
);
