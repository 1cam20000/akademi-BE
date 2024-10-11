import { TeacherModel } from "../models/teacher.model.js";

const generateTeacherId = async () => {
  let id;
  do {
    id = Math.floor(10000000 + Math.random() * 90000000).toString(); // Tạo mã 8 chữ số
  } while (await TeacherModel.findOne({ studentId: id })); // Kiểm tra xem mã đã tồn tại chưa
  return id;
};

export { generateTeacherId };
