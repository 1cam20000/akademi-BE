// import ClassModel from "../models/ClassModel.js";
import { handleValidationError } from "../middlewares/errorHandler.js";
import SubjectModel from "../models/SubjectModel.js";

const getSubject = async (req, res) => {
  try {
    // Lấy tất cả các môn học với thông tin giáo viên
    const subjects = await SubjectModel.find().populate("teacher", "_id");

    // Tạo một đối tượng để lưu trữ dữ liệu tạm thời theo tên môn
    const subjectMap = {};

    subjects.forEach((subject) => {
      const tenMon = subject.name;
      const giaoVienIds = subject.teacher.map((teacher) =>
        teacher._id.toString()
      );

      if (!subjectMap[tenMon]) {
        subjectMap[tenMon] = new Set(giaoVienIds); // Tạo set để tránh trùng lặp
      } else {
        giaoVienIds.forEach((id) => subjectMap[tenMon].add(id)); // Thêm các giáo viên vào set
      }
    });

    // Chuyển đổi đối tượng subjectMap thành mảng kết quả
    const subjectRecords = Object.entries(subjectMap).map(
      ([tenMon, giaoVienSet]) => ({
        tenMon,
        giaoVien: Array.from(giaoVienSet), // Chuyển set thành mảng
      })
    );

    res.status(200).json({
      success: true,
      subjectRecords,
    });
  } catch (error) {
    res.status(400).json({
      message: `Get subjects controller error: ${error.message}`,
    });
  }
};

const addSubject = async (req, res) => {
  const { subjectData } = req.body;

  try {
    if (
      !subjectData ||
      !Array.isArray(subjectData) ||
      subjectData.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Subject data is missing or invalid!",
      });
    }

    const subjectRecords = [];

    for (const record of subjectData) {
      const { teacher, name } = record;

      let existingSubject = await SubjectModel.findOne({ name });

      if (existingSubject) {
        if (!existingSubject.teacher.includes(teacher)) {
          existingSubject.teacher.push(teacher);
          await existingSubject.save();
        } else {
          throw new Error(`Giáo viên đã đang dạy môn ${name}`);
        }
      } else {
        const newSubject = await SubjectModel.create({
          teacher: [teacher],
          name,
        });
        subjectRecords.push(newSubject);
      }
    }

    res.status(200).json({
      success: true,
      message: "Subject created/updated successfully!",
      subjectRecords,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `Add subject controller error: ${error.message}`,
    });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subject = await SubjectModel.findById(req.body.subjectId);

    if (!subject) {
      return res.status(404).json({
        message: "Môn học không tìm thấy",
      });
    }

    await SubjectModel.findOneAndDelete({
      _id: req.body.subjectId,
    });

    res.status(200).json({
      message: "Xóa môn học thành công",
      deletedSubject: subject, 
    });
  } catch (error) {
    res.status(400).json({
      message: `Lỗi khi xóa môn học: ${error.message}`,
    });
  }
};

export { getSubject, addSubject, deleteSubject };
