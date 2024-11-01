import jwt from "jsonwebtoken";

const validateAdminToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied: No token provided" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = verified;

    if (req.admin.role !== "admin") {
      return res.status(403).json({ message: "Access Denied: Not an admin" });
    }

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token: " + error.message });
  }
};

export { validateAdminToken };
