const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  // const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.userId = payload.id;
    next();
  });
};
