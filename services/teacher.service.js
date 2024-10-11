import { TeacherModel } from "../models/teacher.model.js";

const getAllTeachers = async (req, res) => {
  try {
    const allTeachers = await TeacherModel.find({});

    res.status(200).json({
      message: "Get all students successfully ",
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

const updateTeachers = async (req, res) => {
  try {
    await TeacherModel.findOneAndUpdate(
      {
        _id: req.body.teacherId,
      },
      req.body.payload
    );
    res.status(201).json({
      message: "Update teacher's information successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: `Update teacher controller error: ${error.message}`,
    });
  }
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

export {
  getAllTeachers,
  createTeacher,
  updateTeachers,
  deleteTeachers,
  findOneTeacher,
};
