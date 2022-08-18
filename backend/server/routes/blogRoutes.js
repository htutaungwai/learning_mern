const express = require("express");
const router = express.Router();
const {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogControllers");
const auth = require("../middleware/authMiddleware");

router.get("/", [auth], getBlogs);
router.post("/", [auth], createBlog);
router.put("/:id", [auth], updateBlog);
router.delete("/:id", [auth], deleteBlog);

module.exports = router;
