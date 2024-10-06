import express from "express";
import { addStudent } from "../services/admin.service.js";

const adminRouter = express.Router();

//admin them hoc sinh
adminRouter.post("/add-student", async (req, res) => {
  try {
    const newStudent = await addStudent(req.body);
    res.json(newStudent);
  } catch (error) {
    console.error(error);
    if (error.message === "Email already exists") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
});




export { adminRouter };
