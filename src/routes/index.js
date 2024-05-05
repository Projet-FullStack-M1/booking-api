const express = require("express");
const router = express.Router();

const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const postRouter = require("./post.route");
const testRouter = require("./test.route");

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/test", testRouter);

module.exports = router;
