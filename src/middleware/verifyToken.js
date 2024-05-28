const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  } else {
    token = req.cookies.token; // Utilisez le cookie si le header n'est pas présent
  }
  console.log("TOKEN :", token);

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
