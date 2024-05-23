const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
  // const token = req.cookies.token;
  console.log("TOKEN", token);

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
