import express from "express";
import {
  addStudent,
  createAdmin,
  loginAdmin,
} from "../services/admin.service.js";

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

adminRouter.post("/regis", async (req, res) => {
  try {
    const admin = await createAdmin(req.body); // Gọi hàm createAdmin
    res
      .status(201)
      .json({ message: "Admin account created successfully", admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

adminRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await loginAdmin(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

export { adminRouter };
