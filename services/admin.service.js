import bcrypt from "bcrypt";
import { createStudent, findOneStudent } from "./student.service.js";
import { generateStudentId } from "../utils/generateStudentId.js";
import { AdminModel } from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import { createTeacher } from "./teacher.service.js";
import { TeacherModel } from "../models/teacher.model.js";
import { generateTeacherId } from "../utils/generateTeacherId.js";

// Tạo tài khoản admin(1 lan)
const createAdmin = async (body) => {
  try {
    const { email, password } = body; // Lấy email và password từ body

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await AdminModel.create({
      email: email,
      password: hashedPassword,
    });

    return admin; // Trả về tài khoản admin đã được tạo
  } catch (error) {
    console.error("Error creating admin:", error);
    throw new Error("Could not create admin");
  }
};

// Hàm đăng nhập admin
async function loginAdmin(email, password) {
  try {
    // Tìm admin qua email
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      throw new Error("Admin not found");
    }

    // So sánh mật khẩu đã mã hóa
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }

    // Tạo token JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7h" }
    );

    return { message: "Login successful", token };
  } catch (error) {
    throw new Error("Login failed: " + error.message);
  }
}

// admin add student in school
const addStudent = async (studentData) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    email,
    parentName,
    phone,
    address,
    parentEmail,
    parentPhone,
    parentAddress,
    payment,
  } = studentData;

  const studentId = await generateStudentId();

  const password = dateOfBirth;

  const emailExisted = await findOneStudent({ email });
  if (emailExisted) {
    throw new Error("Email already exists");
  }

  const passwordHash = await bcrypt.hash(
    password,
    parseInt(process.env.HASH) || 10
  );

  const newStudent = await createStudent({
    studentId,
    password: passwordHash,
    email,
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
    studentTeacher: [],
    isDelete: false,
  });

  return {
    ...newStudent.toObject(),
    studentId,
  };
};

// admin add teacher in school
const addTeacher = async (teacherData) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      email,
      phone,
      address,
      photo,
      placeOfBirth,
      university,
      degree,
      startEndDate,
      city,
    } = teacherData;

    // Kiểm tra nếu email đã tồn tại
    const emailExisted = await TeacherModel.findOne({ email }).lean(); // Sử dụng .lean() để trả về đối tượng JS thông thường
    if (emailExisted) {
      throw new Error("Email already exists");
    }

    // Sử dụng ngày sinh làm mật khẩu (cần xem xét cải thiện)
    const password = dateOfBirth;

    // Mã hóa mật khẩu
    const passwordHash = await bcrypt.hash(
      password,
      parseInt(process.env.HASH) || 10
    );

    // Tạo ID cho giáo viên
    const teacherId = await generateTeacherId();

    // Tạo mới giáo viên
    const newTeacher = new TeacherModel({
      teacherId,
      email,
      password: passwordHash,
      firstName,
      lastName,
      phone,
      address,
      photo,
      dateOfBirth,
      placeOfBirth,
      university,
      degree,
      startEndDate,
      city,
      teacherStudent: [], // Danh sách học sinh của giáo viên
    });

    const savedTeacher = await newTeacher.save();

    return {
      ...savedTeacher.toObject(),
      teacherId,
    };
  } catch (error) {
    console.error("Error adding teacher:", error);
    throw new Error("Could not add teacher");
  }
};

export { addStudent, createAdmin, loginAdmin, addTeacher };
