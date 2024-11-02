import { ClassModel } from "../models/Class.model.js";
import { TeacherModel } from "../models/teacher.model.js";

// Lấy tất cả các lớp học
const getAllClasses = async (req, res) => {
  try {
    const allClasses = await ClassModel.find({});
    res.status(200).json({
      message: "Lấy tất cả lớp học thành công",
      data: allClasses,
    });
  } catch (error) {
    res.status(400).json({
      message: `Lỗi khi lấy lớp học: ${error.message}`,
    });
  }
};

// Admin thêm lớp học
const addClassesByAdmin = async (req, res) => {
  const { className, teacher } = req.body; // Chỉ cần className và teacher
  try {
    if (!className || !teacher) {
      throw new Error(
        "Vui lòng cung cấp đầy đủ thông tin lớp học và giáo viên"
      );
    }

    // Kiểm tra xem lớp học đã tồn tại chưa
    const existingClass = await ClassModel.findOne({ className });
    if (existingClass) {
      throw new Error("Lớp học đã tồn tại");
    }

    // Tìm giáo viên dựa trên ID
    const teacherData = await TeacherModel.findById(teacher);
    if (!teacherData) {
      throw new Error("Không tìm thấy giáo viên");
    }

    // Tạo lớp học mới với mảng học sinh rỗng
    const newClass = new ClassModel({
      className,
      teacher,
      students: [],
    });
    await newClass.save();

    // Cập nhật lớp học cho giáo viên
    teacherData.teacherClass.push(newClass._id);
    await teacherData.save();

    res.status(201).json({
      message: "Thêm lớp học thành công!",
      data: {
        _id: newClass._id,
        className: newClass.className,
        teacherName: `${teacherData.firstName} ${teacherData.lastName}`,
        students: newClass.students,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: `Lỗi khi thêm lớp học: ${error.message}`,
    });
  }
};

// Xóa lớp học
const deleteClasses = async (req, res) => {
  try {
    const classToDelete = await ClassModel.findOneAndDelete({
      _id: req.body.classId,
    });

    if (!classToDelete) {
      throw new Error("Không tìm thấy lớp học để xóa");
    }

    res.status(201).json({
      message: "Xóa lớp học thành công",
    });
  } catch (error) {
    res.status(400).json({
      message: `Lỗi khi xóa lớp học: ${error.message}`,
    });
  }
};

// Giáo viên thêm học sinh vào lớp
const addStudentToClass = async (classId, studentId, teacherId) => {
  const classData = await ClassModel.findById(classId);

  if (!classData) {
    throw new Error("Không tìm thấy lớp học");
  }

  // Kiểm tra giáo viên có quyền thêm học sinh không
  if (classData.teacher.toString() !== teacherId.toString()) {
    throw new Error("Bạn không có quyền thêm học sinh vào lớp này");
  }

  // Kiểm tra nếu học sinh đã có trong lớp
  if (classData.students.includes(studentId)) {
    throw new Error("Học sinh đã có trong lớp");
  }

  // Thêm học sinh vào lớp
  classData.students.push(studentId);
  await classData.save();

  return classData;
};

// Hàm lấy tổng số lớp học
const getTotalClasses = async () => {
  try {
    const totalClasses = await ClassModel.countDocuments({ isDelete: false }); // Đếm các lớp học không bị xóa
    return totalClasses;
  } catch (error) {
    throw new Error("Unable to retrieve total classes"); // Ném lỗi nếu có vấn đề xảy ra
  }
};

export {
  getAllClasses,
  addClassesByAdmin,
  deleteClasses,
  addStudentToClass,
  getTotalClasses,
};
