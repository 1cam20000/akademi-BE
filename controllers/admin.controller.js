import express from "express";
import {
  addStudent,
  addTeacher,
  createAdmin,
  loginAdmin,
} from "../services/admin.service.js";
import { validateAdminToken } from "../middlewares/validateAdminToken.js";
import {
  addClassesByAdmin,
  deleteClasses,
  getAllClasses,
} from "../services/Class.service.js";
import { deleteStudent, getAllStudents, getStudentProfile, getStudentProfileByStudentId, updateStudent } from "../services/student.service.js";
import { deleteTeachers, getAllTeachers } from "../services/teacher.service.js";

const adminRouter = express.Router();

// adminRouter.post("/regis", async (req, res) => {
//   try {
//     const admin = await createAdmin(req.body); // Gọi hàm createAdmin
//     res
//       .status(201)
//       .json({ message: "Admin account created successfully", admin });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

adminRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await loginAdmin(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

////////////////////////////////////////////////////////////////

//admin them hoc sinh
adminRouter.post("/add-student", validateAdminToken, async (req, res) => {
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

// Admin lấy tất cả sinh viên
adminRouter.get("/all-students", validateAdminToken, async (req, res) => {
  try {
    const students = await getAllStudents();
    res.status(200).json({
      message: "Lấy danh sách sinh viên thành công",
      data: students,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Admin xóa sinh viên
adminRouter.delete("/delete-student/:id", validateAdminToken, async (req, res) => {
  const studentId = req.params.id;
  try {
    const deletedStudent = await deleteStudent(studentId);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên để xóa" });
    }
    res.status(200).json({
      message: "Xóa sinh viên thành công",
      data: deletedStudent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Admin lấy thông tin hồ sơ sinh viên
adminRouter.get("/profile-student/:studentId", validateAdminToken, async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const studentProfile = await getStudentProfileByStudentId(studentId);
    if (!studentProfile) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên" });
    }
    res.status(200).json({
      message: "Lấy thông tin sinh viên thành công",
      data: studentProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Admin cập nhật thông tin sinh viên
adminRouter.put("/update-student/:id", validateAdminToken, async (req, res) => {
  const studentId = req.params.id;
  try {
    const updatedStudent = await updateStudent(studentId, req.body);
    res.status(200).json({
      message: "Cập nhật sinh viên thành công",
      data: updatedStudent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

////////////////////////////////////////////////////////////////

//admin add teacher
adminRouter.post("/add-teacher", validateAdminToken, async (req, res) => {
  try {
    const newTeacher = await addTeacher(req.body);
    res.json(newTeacher);
  } catch (error) {
    console.error(error);
    if (error.message === "Email already exists") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
});

//admin lay danh sach giao vien
adminRouter.get("/all-teachers", validateAdminToken, getAllTeachers);

// admin xóa giáo viên
adminRouter.delete("/teachers/:teacherId", validateAdminToken, deleteTeachers);


////////////////////////////////////////////////////////////////

// API lấy tất cả các lớp học
adminRouter.get("/all-classes", validateAdminToken, async (req, res) => {
  try {
    await getAllClasses(req, res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin thêm lớp học
adminRouter.post("/add-class", validateAdminToken, async (req, res) => {
  try {
    await addClassesByAdmin(req, res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// API xóa lớp học
adminRouter.delete("/delete-class", validateAdminToken, async (req, res) => {
  try {
    await deleteClasses(req, res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export { adminRouter };
