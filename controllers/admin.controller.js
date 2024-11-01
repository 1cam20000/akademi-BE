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
  getTotalClasses,
} from "../services/Class.service.js";
import {
  deleteStudent,
  getAllStudents,
  getStudentProfile,
  getStudentProfileByStudentId,
  getTotalStudents,
  updateStudent,
} from "../services/student.service.js";
import {
  deleteTeachers,
  getAllTeachers,
  getTeacherProfile,
  getTotalTeachers,
} from "../services/teacher.service.js";

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

//Admin xem tong so hoc sinh
adminRouter.get("/total-students", validateAdminToken, async (req, res) => {
  console.log("Received request to get total students");

  try {
    const totalStudents = await getTotalStudents();
    console.log("Total students:", totalStudents);
    res.status(200).json({ totalStudents });
  } catch (error) {
    console.error("Error getting total students:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi khi lấy tổng số học sinh.",
      error: error.message,
    });
  }
});

// Admin xóa sinh viên
adminRouter.delete(
  "/delete-student/:id",
  validateAdminToken,
  async (req, res) => {
    const studentId = req.params.id;
    try {
      const deletedStudent = await deleteStudent(studentId);
      if (!deletedStudent) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy sinh viên để xóa" });
      }
      res.status(200).json({
        message: "Xóa sinh viên thành công",
        data: deletedStudent,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Admin lấy thông tin hồ sơ sinh viên
adminRouter.get(
  "/profile-student/:studentId",
  validateAdminToken,
  async (req, res) => {
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
  }
);

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

// admin lấy thông tin giáo viên
adminRouter.get(
  "/teacher-profile/:teacherId",
  validateAdminToken,
  async (req, res) => {
    const { teacherId } = req.params;
    console.log(`Received request to get profile for teacherId: ${teacherId}`);

    try {
      const teacherProfile = await getTeacherProfile(teacherId);
      res.status(200).json(teacherProfile);
    } catch (error) {
      console.error("Error getting teacher profile:", error);
      res
        .status(500)
        .json({
          message: "Đã xảy ra lỗi khi lấy hồ sơ giáo viên.",
          error: error.message,
        });
    }
  }
);

// admin xem tong so giao vien
adminRouter.get("/total-teachers", validateAdminToken, async (req, res) => {
  try {
    const totalTeachers = await getTotalTeachers();
    res.status(200).json({ totalTeachers });
  } catch (error) {
    console.error("Error getting total teachers:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi khi lấy tổng số giáo viên.",
      error: error.message,
    });
  }
});

// admin xóa giáo viên
adminRouter.delete(
  "/delete-teacher/:teacherId",
  validateAdminToken,
  async (req, res) => {
    const teacherId = req.params.teacherId;
    try {
      const deletedTeacher = await deleteTeachers(teacherId);
      if (!deletedTeacher) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy giáo viên để xóa" });
      }
      res.status(200).json({
        message: "Xóa giáo viên thành công",
        data: deletedTeacher,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
);

////////////////////////////////////////////////////////////////

// API lấy tất cả các lớp học
adminRouter.get("/all-classes", validateAdminToken, async (req, res) => {
  try {
    await getAllClasses(req, res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Admin xem tong so lop hoc
adminRouter.get("/total-classes", validateAdminToken, async (req, res) => {
  try {
    const totalClasses = await getTotalClasses();
    if (totalClasses === 0) {
      return res.status(200).json({
        message: "Không có lớp học nào trong cơ sở dữ liệu.",
        totalClasses,
      });
    }

    console.log("Total classes:", totalClasses);
    res.status(200).json({ totalClasses });
  } catch (error) {
    console.error("Error getting total classes:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi khi lấy tổng số lớp học.",
      error: error.message,
    });
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
