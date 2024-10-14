import jwt from "jsonwebtoken";

const validateTeacherToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Lấy token từ header

  if (!token) {
    return res
      .status(403)
      .json({ message: "Không có token, truy cập bị từ chối" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
    req.teacher = decoded; // Lưu thông tin giáo viên vào request
    next(); // Tiếp tục đến middleware hoặc route tiếp theo
  });
};

export { validateTeacherToken };
