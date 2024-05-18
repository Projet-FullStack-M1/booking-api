const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");

const router = express.Router();

router.get("/all", getPosts);
router.get("/:id", getPost);
router.post("/new", verifyToken, addPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

module.exports = router;
