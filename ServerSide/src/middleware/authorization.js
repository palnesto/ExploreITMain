const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_KEY || "your-secret-key";

const authMidd = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(403).send({ status: false, message: "Missing authentication token in request" });
    }

    const decoded = jwt.verify(token, secretKey);
    if (!decoded) {
      return res.status(403).send({ status: false, message: "Invalid authentication token in request" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).send({ status: false, message: "Provide a valid token" });
  }
};

module.exports = authMidd;
