const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/userControllers");

router.post("/register", registerUser);
// router.post("/login", loginUser);

// router.get("/profile", getProfile);

module.exports = router;