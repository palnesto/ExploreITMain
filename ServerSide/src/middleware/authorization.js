const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "chessBoard"; // Use environment variable for secret key

const authMidd = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ status: false, msg: "Unauthorized user" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).send({ status: false, msg: "Unauthorized user" });
  }

  const token = parts[1];

  // Verify the token using jwt.verify
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      // If token is not valid or expired, respond with an error
      return res.status(401).send({ status: false, msg: "Unauthorized: Invalid token" });
    } else {
      // If token is valid, attach decoded token to request and continue
      req.user = decoded;
      next();
    }
  });
};

module.exports = authMidd;
