const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const secret = process.env.JWT_KEY;
const authMiddleWare = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token)
    if (token) {
      const decoded = jwt.verify(token, secret);
      console.log(decoded)
      req.body._id = decoded?.id;
    } else {
      return res.status(401).json({ message: "Authorization token is missing" });
    }
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleWare;
