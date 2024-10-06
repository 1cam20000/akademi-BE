import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findOneStudent } from "../services/student.service.js";

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
      console.log("🚀 ~ studentRouter.post ~ payload:", payload);

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

export { studentRouter };
