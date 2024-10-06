import jwt from "jsonwebtoken";
import { findOneStudentWithoutPassword } from "../services/student.service.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startWith("Bearer ")) {
      return res.status(401).json({ message: "khong tim thay token" });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🚀 ~ authMiddleware ~ decodedToken:", decodedToken);

    const user = await findOneStudentWithoutPassword({ _id: decodedToken._id });
    console.log("🚀 ~ authMiddleware ~ user:", user);
    if (!user) {
      return res
        .status(401)
        .json({ message: "khong tim thay student thro _id" });
    }
    res.user = user;
    next();
  } catch (error) {
    return res.status(404).json({ message: "unauthorized" });
  }
};
export { authMiddleware };


