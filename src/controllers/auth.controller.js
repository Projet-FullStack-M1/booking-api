const bcrypt = require("bcrypt");
const prisma = require("../../prisma/prisma");
const jwt = require("jsonwebtoken");
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    //  Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      // If the email already exists, return a 400 status with an error message
      return res.status(400).json({ message: "Email already exists" });
    }

    //  Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save it in the database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // send an email to the new user and return a 201 status with a success message

    console.log(newUser);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // If everything is correct, send the user a JWT
    // res.setHeader("Set-Cookie", "test=" + "myValue").json("success");

    const age = 1000 * 24 * 60 * 60 * 7;
    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: true,
      },
      process.env.JWT_SECRET_Key,
      { expiresIn: age }
    );

    // send the user information
    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure : true
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login !" });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout successful" });
};
