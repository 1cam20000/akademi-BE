import { TeacherModel } from "../models/teacher.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ClassModel } from "../models/Class.model.js";
import { StudentModel } from "../models/student.model.js";

const getAllTeachers = async (req, res) => {
  try {
    const allTeachers = await TeacherModel.find({});

    res.status(200).json({
      message: "Get all teacher successfully ",
      data: allTeachers,
    });
  } catch (error) {
    res.status(400).json({
      message: `Get teacher controller error: ${error.message}`,
    });
  }
};

// Tạo giáo viên
const createTeacher = async (teacherData) => {
  try {
    const newTeacher = new TeacherModel(teacherData);
    await newTeacher.save();

    const teacherObject = newTeacher.toObject();
    return {
      message: "Teacher added successfully",
      data: teacherObject,
    };
  } catch (error) {
    console.error("Error adding teacher:", error);
    throw new Error("Could not add teacher");
  }
};

// Đăng nhập giáo viên và tạo token
const teacherLogin = async (req, res) => {
  const { teacherId, password } = req.body;

  try {
    // Tìm giáo viên theo teacherId
    const teacher = await TeacherModel.findOne({ teacherId });

    if (teacher) {
      // Kiểm tra mật khẩu
      const checkPassword = await bcrypt.compare(password, teacher.password);

      if (checkPassword) {
        const {
          teacherId,
          firstName,
          lastName,
          email,
          phone,
          address,
          degree,
          _id,
        } = teacher;

        // Tạo payload chứa thông tin giáo viên
        const payload = {
          teacherId,
          firstName,
          lastName,
          email,
          phone,
          address,
          degree,
          _id,
        };

        // Tạo token với thông tin giáo viên
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "7d", // Token có thời hạn 7 ngày
        });

        // Trả về token
        res.json({ token });
      } else {
        return res.status(400).json({ message: "Password incorrect!" });
      }
    } else {
      return res.status(400).json({ message: "Teacher ID not found!" });
    }
  } catch (error) {
    res.status(500).json({
      message: `Lỗi khi đăng nhập: ${error.message}`,
    });
  }
};

// Cập nhật thông tin cá nhân giáo viên
const updateTeacherProfile = async (teacherId, body) => {
  const updatedTeacher = await TeacherModel.findByIdAndUpdate(teacherId, body, {
    new: true,
  }).select("-password");
  if (!updatedTeacher) {
    throw new Error("Không thể cập nhật giáo viên");
  }
  return updatedTeacher;
};

// Lấy danh sách các lớp mà giáo viên đang quản lý
const getTeacherClasses = async (teacherId) => {
  const classes = await ClassModel.find({ teacher: teacherId });
  if (!classes) {
    throw new Error("Không tìm thấy lớp học");
  }
  return classes;
};

// Lấy danh sách học sinh của lớp giáo viên đang quản lý
const getClassStudents = async (teacherId, classId) => {
  try {
    const classData = await ClassModel.findOne({
      _id: classId,
      teacher: teacherId,
    }).populate("students");

    if (!classData) {
      throw new Error(
        "Không tìm thấy lớp hoặc bạn không có quyền truy cập lớp này"
      );
    }

    return classData.students;
  } catch (error) {
    console.error("Lỗi khi truy vấn lớp:", error);
    throw error; // Ném lại lỗi để có thể xử lý ở bên ngoài
  }
};

// Lấy thông tin chi tiết của học sinh trong lop
const getStudentDetails = async (studentId) => {
  const student = await StudentModel.findById(studentId).select("-password");
  if (!student) {
    throw new Error("Không tìm thấy học sinh");
  }
  return student;
};

const deleteTeachers = async (req, res) => {
  try {
    await TeacherModel.findOneAndDelete({
      _id: req.body.teacherId,
    });

    res.status(201).json({
      message: "Delete teacher's information successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: `Delete teacher controller error: ${error.message}`,
    });
  }
};

// Tìm giáo viên qua email
const findOneTeacher = async (filter) => {
  return await TeacherModel.findOne(filter);
};

// Lấy thông tin cá nhân giáo viên
const getTeacherProfile = async (teacherId) => {
  const teacher = await TeacherModel.findById(teacherId).select("-password");
  if (!teacher) {
    throw new Error("Không tìm thấy giáo viên");
  }
  return teacher;
};

// cap nhat diem so cho sinh vien
const updateStudentGrades = async (req, res) => {
  const { classId } = req.params;
  const { studentId, grade } = req.body; 

  try {
    const classData = await ClassModel.findById(classId).populate("students");

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    const student = await StudentModel.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const classIndex = student.classes.findIndex(c => c.classId.equals(classId));

    if (classIndex !== -1) {
      student.classes[classIndex].grade = grade; 
      await student.save();
      return res.status(200).json({ message: "Grades updated successfully" });
    } else {
      return res.status(404).json({ message: "Student not enrolled in this class" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Phương thức xóa điểm số
const deleteStudentGrade = async (req, res) => {
  const { classId } = req.params;
  const { studentId } = req.body; 

  try {
    const student = await StudentModel.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const classIndex = student.classes.findIndex(c => c.classId.equals(classId));

    if (classIndex !== -1) {
      // Xóa điểm số
      student.classes[classIndex].grade = undefined; // Hoặc student.classes.splice(classIndex, 1); nếu muốn xóa hoàn toàn lớp
      await student.save();
      return res.status(200).json({ message: "Grade deleted successfully" });
    } else {
      return res.status(404).json({ message: "Student not enrolled in this class" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  getAllTeachers,
  createTeacher,
  deleteTeachers,
  findOneTeacher,
  getTeacherProfile,
  teacherLogin,
  updateTeacherProfile,
  getTeacherClasses,
  getClassStudents,
  getStudentDetails,
  deleteStudentGrade,
  updateStudentGrades,
};
