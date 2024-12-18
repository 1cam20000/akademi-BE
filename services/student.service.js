import { StudentModel } from "../models/student.model.js";
import bcrypt from "bcrypt";

//create a new student
const createStudent = async (body) => {
  try {
    // console.log("Creating student with data:", body);

    const student = await StudentModel.create(body);
    return student;
  } catch (error) {
    console.error("Error creating student:", error);
    throw new Error("Could not create student");
  }
};

//find one student to check mail existed (with password)
const findOneStudent = async (query) => {
  const student = StudentModel.findOne(query).exec();
  return student;
};

//find one student to check email existed (without password)
const findOneStudentWithoutPassword = async (query) => {
  const student = StudentModel.findOne(query).select("-password").exec();
  return student;
};

const getStudentProfileByStudentId = async (studentId) => {
  const student = await StudentModel.findOne({ studentId: studentId })
    .select("-password")
    .exec();
  return student;
};

//get all students
const getAllStudents = async () => {
  const students = await StudentModel.find().exec();
  return students;
};

//count students
const getTotalStudents = async () => {
  try {
    const totalStudents = await StudentModel.countDocuments({ isDelete: false }); // Đếm số học sinh không bị xóa
    return totalStudents;
  } catch (error) {
    throw new Error("Unable to retrieve total students"); // Ném lỗi nếu có vấn đề xảy ra
  }
};

//update student
const updateStudent = async (id, body) => {
  if (body.password) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword;
  }

  // Xóa trường msv nếu có trong body
  delete body.studentId;

  const updatedStudent = await StudentModel.findByIdAndUpdate(id, body, {
    new: true,
  }).lean();
  return updatedStudent;
};

//delete student
const deleteStudent = async (id) => {
  const deletedStudent = await StudentModel.findByIdAndDelete(id);
  return deletedStudent;
};

// get student profile
const getStudentProfile = async (query) => {
  const student = await StudentModel.findOne(query).select("-password").exec();
  return student;
};

export {
  getTotalStudents,
  createStudent,
  findOneStudent,
  findOneStudentWithoutPassword,
  getAllStudents,
  updateStudent,
  deleteStudent,
  getStudentProfile,
  getStudentProfileByStudentId,
};
