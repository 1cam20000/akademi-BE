import express from "express";
import {
  deleteStudentGrade,
  getClassStudents,
  getStudentDetails,
  getTeacherClasses,
  getTeacherProfile,
  teacherLogin,
  updateStudentGrades,
  updateTeacherProfile,
} from "../services/teacher.service.js";
import { validateTeacherToken } from "../middlewares/validateTeacherToken.js";
import { ClassModel } from "../models/Class.model.js";
import { StudentModel } from "../models/student.model.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const teacherRouter = express.Router();

// Đăng nhập giáo viên
teacherRouter.post("/login", teacherLogin);

// Lấy thông tin cá nhân của giáo viên
teacherRouter.get("/profile", validateTeacherToken, async (req, res) => {
  try {
    const teacherId = req.teacher._id;
    const profile = await getTeacherProfile(teacherId);
    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({
      message: `Lỗi khi lấy thông tin giáo viên: ${error.message}`,
    });
  }
});

// Cập nhật thông tin cá nhân của giáo viên
teacherRouter.put("/update-profile", validateTeacherToken, async (req, res) => {
  try {
    const teacherId = req.teacher._id;
    const updatedProfile = await updateTeacherProfile(teacherId, req.body);
    res.status(200).json({
      message: "Cập nhật thông tin giáo viên thành công",
      data: updatedProfile,
    });
  } catch (error) {
    res.status(400).json({
      message: `Lỗi khi cập nhật thông tin giáo viên: ${error.message}`,
    });
  }
});

// Lấy danh sách các lớp giáo viên quản lý
teacherRouter.get("/my-classes", validateTeacherToken, async (req, res) => {
  try {
    const teacherId = req.teacher._id;
    const classes = await getTeacherClasses(teacherId);
    res.status(200).json({
      message: "Lấy danh sách lớp thành công",
      data: classes,
    });
  } catch (error) {
    res.status(400).json({
      message: `Lỗi khi lấy danh sách lớp: ${error.message}`,
    });
  }
});

// Lấy danh sách học sinh của lớp
teacherRouter.get(
  "/classes/:classId/students",
  validateTeacherToken,
  async (req, res) => {
    try {
      const teacherId = req.teacher._id;
      const classId = req.params.classId;
      const students = await getClassStudents(teacherId, classId);
      res.status(200).json({
        message: "Lấy danh sách học sinh thành công",
        data: students,
      });
    } catch (error) {
      res.status(400).json({
        message: `Lỗi khi lấy danh sách học sinh: ${error.message}`,
      });
    }
  }
);

// Lấy thông tin chi tiết của một học sinh
teacherRouter.get(
  "/students/:studentId",
  validateTeacherToken,
  async (req, res) => {
    try {
      const studentId = req.params.studentId;
      const studentDetails = await getStudentDetails(studentId);
      res.status(200).json({
        message: "Lấy thông tin học sinh thành công",
        data: studentDetails,
      });
    } catch (error) {
      res.status(400).json({
        message: `Lỗi khi lấy thông tin học sinh: ${error.message}`,
      });
    }
  }
);

// Thêm học sinh vào lớp
teacherRouter.post(
  "/classes/:classId/add-students",
  validateTeacherToken,
  async (req, res) => {
    const teacherId = req.teacher._id;
    const classId = req.params.classId;
    const { studentId, className, year } = req.body;

    try {
      const classData = await ClassModel.findOne({
        _id: classId,
        teacher: teacherId,
      });
      if (!classData) {
        return res.status(404).json({
          message:
            "Không tìm thấy lớp hoặc bạn không có quyền truy cập lớp này",
        });
      }

      if (classData.students.includes(studentId)) {
        return res.status(400).json({
          message: "Học sinh đã tồn tại trong lớp này.",
        });
      }

      const studentData = await StudentModel.findById(studentId);
      if (!studentData) {
        return res.status(404).json({
          message: "Học sinh không tồn tại.",
        });
      }

      classData.students.push(studentId);
      await classData.save();

      await StudentModel.findByIdAndUpdate(
        studentId,
        {
          $addToSet: {
            studentTeacher: teacherId,
            classes: {
              classId: new ObjectId(classId), // Sử dụng new ObjectId
              className: className || "Chưa xác định",
              year: year || "Chưa xác định",
            },
          },
        },
        { new: true }
      );

      res.status(201).json({
        message: "Thêm học sinh vào lớp thành công!",
        data: {
          classId: classId,
          className: className || "Chưa xác định",
          students: classData.students,
        },
      });
    } catch (error) {
      console.error("Lỗi khi thêm học sinh vào lớp:", error);
      res.status(500).json({
        message: `Lỗi khi thêm học sinh vào lớp: ${error.message}`,
      });
    }
  }
);

// Xóa học sinh khỏi lớp
teacherRouter.delete(
  "/classes/:classId/remove-student/:studentId",
  validateTeacherToken,
  async (req, res) => {
    const teacherId = req.teacher._id; // Lấy ID giáo viên từ token
    const classId = req.params.classId; // Lấy ID lớp từ tham số URL
    const studentId = req.params.studentId; // Lấy ID học sinh từ tham số URL

    try {
      // Tìm lớp mà giáo viên đang quản lý
      const classData = await ClassModel.findOne({
        _id: classId,
        teacher: teacherId,
      });

      if (!classData) {
        return res.status(404).json({
          message:
            "Không tìm thấy lớp hoặc bạn không có quyền truy cập lớp này",
        });
      }

      // Kiểm tra xem học sinh có trong lớp không
      if (!classData.students.includes(studentId)) {
        return res.status(400).json({
          message: "Học sinh không tồn tại trong lớp này.",
        });
      }

      // Xóa học sinh khỏi lớp
      classData.students.pull(studentId);
      await classData.save();

      // Cập nhật thông tin lớp vào trường classes của học sinh
      await StudentModel.findByIdAndUpdate(
        studentId,
        {
          $pull: {
            classes: {
              classId: classId,
            },
          },
        },
        { new: true }
      );

      res.status(200).json({
        message: "Xóa học sinh khỏi lớp thành công!",
        data: {
          classId: classId,
          students: classData.students,
        },
      });
    } catch (error) {
      console.error("Lỗi khi xóa học sinh khỏi lớp:", error); // Ghi log lỗi
      res.status(500).json({
        message: `Lỗi khi xóa học sinh khỏi lớp: ${error.message}`,
      });
    }
  }
);

// Route cập nhật điểm số cho hs trong lop 
teacherRouter.put(
  "/update-grades/:classId",
  validateTeacherToken,
  updateStudentGrades
);

// Route xóa điểm số 
teacherRouter.delete(
  "/delete-grades/:classId",
  validateTeacherToken,
  deleteStudentGrade
);

export { teacherRouter };
