const prisma = require("../../prisma/prisma");
const bcrypt = require("bcrypt");

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user" });
  }
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  const { password, avatar, ...inputs } = req.body;
  // compare the user id from the token with the id from the request
  if (tokenUserId !== id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  let updatedPassword = null;

  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update user" });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  // compare the user id from the token with the id from the request
  if (tokenUserId !== id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};
