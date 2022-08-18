const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  registerUser,
  getProfile,
  loginUser,
} = require("../controllers/userControllers");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", [auth], getProfile);

module.exports = router;
