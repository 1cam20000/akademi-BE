import { StudentModel } from "../models/student.model.js";

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

//get all students
const getAllStudents = async () => {
  const students = await StudentModel.find().exec();
  return students;
};

//update student
const updateStudent = async (id, body) => {
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
  console.log("🚀 ~ getStudentProfile ~ query:", query);
  const student = await StudentModel.findOne(query).select("-password").exec();
  return student;
};

// get student payment

export {
  createStudent,
  findOneStudent,
  findOneStudentWithoutPassword,
  getAllStudents,
  updateStudent,
  deleteStudent,
  getStudentProfile,
};
