const express = require("express");
const router = express.Router();
const { getBlogs } = require("../controllers/blogControllers");

router.get("/", getBlogs);

module.exports = router;
