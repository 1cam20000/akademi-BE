import bcrypt from "bcrypt";
import { createStudent, findOneStudent } from "./student.service.js";
import { generateStudentId } from "../utils/generateStudentId.js";


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

  const passwordHash = await bcrypt.hash(password, parseInt(process.env.HASH) || 10);
  
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
}

export { addStudent };
