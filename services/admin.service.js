import bcrypt from "bcrypt";
import { createStudent, findOneStudent } from "./student.service.js";
import { generateStudentId } from "../utils/generateStudentId.js";
import { AdminModel } from "../models/admin.model.js";
import jwt from "jsonwebtoken";

// Tạo tài khoản admin
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
      { id: admin._id, email: admin.email },
      "your_jwt_secret_key",
      { expiresIn: "7h" }
    );

    return { message: "Login successful", token };
  } catch (error) {
    throw new Error("Login failed: " + error.message);
  }
}

// admin add student in schoolschool
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

  // Sử dụng ngày sinh làm mật khẩu (nên xem xét lại)
  const password = dateOfBirth;

  // Kiểm tra email tồn tại
  const emailExisted = await findOneStudent({ email });
  if (emailExisted) {
    throw new Error("Email already exists"); // Có thể ném lỗi với mã trạng thái cụ thể
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

const addTeacher = async () => {
  // code thêm giáo viên
};

export { addStudent, createAdmin, loginAdmin };
