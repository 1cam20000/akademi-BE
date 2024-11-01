import jwt from "jsonwebtoken";
import { findOneStudentWithoutPassword } from "../services/student.service.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await findOneStudentWithoutPassword({ _id: decodedToken._id });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (decodedToken.role !== "student") {
      return res.status(403).json({ message: "Access Denied: Not a student" });
    }

    res.user = user; 
    next();
  } catch (error) {
    return res.status(404).json({ message: "Unauthorized" });
  }
};

export { authMiddleware };
