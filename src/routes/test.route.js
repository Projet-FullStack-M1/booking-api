const express = require("express");
const {
  shouldBeLoggedIn,
  shouldBeAdmin,
} = require("../controllers/test.controller");
const { verifyToken } = require("../middleware/verifyToken");

const router = express.Router();

router.get("/shouldbeloggin", verifyToken, shouldBeLoggedIn);
router.get("/shouldbeadmin", shouldBeAdmin);

module.exports = router;
