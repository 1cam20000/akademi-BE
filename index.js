import express from "express";
import { connectMongodb } from "./database/connectMongodb.js";
import { corsMiddleware } from "./middlewares/corsOption.js";
import dotenv from "dotenv";
import { studentRouter } from "./controllers/student.controller.js";
import { adminRouter } from "./controllers/admin.controller.js";

//

const app = express();

//

app.use(express.json());
app.use(corsMiddleware);
dotenv.config();
connectMongodb();
app.use("/student", studentRouter);
app.use("/admin", adminRouter);

//
const port = 8888;
app.listen(
  port,
  console.log(`🚀 ~ PORT:${port}; running at http://localhost:${port} `)
);
