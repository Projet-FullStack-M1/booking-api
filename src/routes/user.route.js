const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/verifyToken");

router.get("/all", userController.getUsers);
// router.get("/:id", verifyToken, userController.getUser);
router.put("/:id", verifyToken, userController.updateUser);
router.delete("/:id", verifyToken, userController.deleteUser);
router.post("/save", verifyToken, userController.savePost);
router.get("/profilePosts", verifyToken, userController.profilePosts);

module.exports = router;
