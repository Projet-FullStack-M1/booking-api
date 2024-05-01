const bcrypt = require("bcrypt");
const prisma = require("../../prisma/prisma");

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
    console.log(hashedPassword);

    // Create a new user and save it in the database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

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
    res.setHeader("Set-Cookie", "test=" + "myValue").json("success");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login ! " });
  }
};

exports.logout = async (req, res) => {};
