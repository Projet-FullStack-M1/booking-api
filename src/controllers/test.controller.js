const jwt = require("jsonwebtoken");
exports.shouldBeLoggedIn = async (req, res) => {
  console.log(req.userId);
  res.status(200).json({ message: "Logged in" });
};

exports.shouldBeAdmin = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Not logged in",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    if (!payload.isAdmin == "admin") {
      return res.status(403).json({
        message: "Not an admin",
      });
    }
  });
  res.status(200).json({
    message: "Logged in",
  });
};
