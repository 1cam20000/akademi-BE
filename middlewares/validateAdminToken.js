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

    next(); 
  } catch (error) {
    res.status(400).json({ message: "Invalid Token: " + error.message });
  }
};

export { validateAdminToken };
