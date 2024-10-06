import { findOneStudent } from "../services/student.service.js";

export async function generateStudentId() {
  let id;
  do {
    id = Math.floor(10000000 + Math.random() * 90000000).toString(); // Tạo mã 8 chữ số
  } while (await findOneStudent({ studentId: id })); // Kiểm tra xem mã đã tồn tại chưa
  return id;
}
