import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findOneStudent,
  getStudentProfile,
  updateStudent,
} from "../services/student.service.js";
import { authMiddleware } from "../middlewares/validateToken.middleware.js";

const studentRouter = express.Router();

studentRouter.post("/login", async (req, res) => {
  const { msv, password } = req.body;
  // console.log("🚀 ~ studentRouter.post ~ req.body:", req.body);

  const student = await findOneStudent({ studentId: msv });

  if (student) {
    // console.log("🚀 ~ studentRouter.post ~ student:", student);

    const checkPassword = await bcrypt.compare(password, student.password);
    // console.log("🚀 ~ studentRouter.post ~ checkPassword:", checkPassword);

    if (checkPassword) {
      const {
        studentId,
        firstName,
        lastName,
        dateOfBirth,
        parentName,
        phone,
        address,
        parentEmail,
        parentPhone,
        parentAddress,
        payment,
        _id,
      } = student;

      const payload = {
        studentId,
        firstName,
        lastName,
        dateOfBirth,
        parentName,
        phone,
        address,
        parentEmail,
        parentPhone,
        parentAddress,
        payment,
        _id,
      };
      // console.log("🚀 ~ studentRouter.post ~ payload:", payload);

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({ token });
    } else {
      return res.status(400).json({ message: "Password incorrect!" });
    }
  } else {
    return res.status(400).json({ message: "MSV not found!" });
  }
});

//student xem thong tin ca nhan
studentRouter.get("/profile", authMiddleware, async (req, res) => {
  try {
    const studentId = res.user._id;
    const student = await getStudentProfile({ _id: studentId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route cập nhật thông tin cá nhân
studentRouter.put("/update-profile", authMiddleware, async (req, res) => {
  const studentId = res.user._id;
  const updateData = req.body;

  try {
    const updatedStudent = await updateStudent(studentId, updateData);

    if (!updatedStudent) {
      return res.status(404).json({ message: "Sinh viên không tồn tại." });
    }

    res.json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error);
    return res
      .status(500)
      .json({ message: "Không thể cập nhật thông tin sinh viên." });
  }
});

export { studentRouter };
  