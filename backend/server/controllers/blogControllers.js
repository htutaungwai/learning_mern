const Blog = require("../models/Blog");
const colors = require("colors");

// @desc    GET all blog by user id
// @route   "/api/blogs"
// @access  Private

const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ user: req.user.id });
    res.json(blogs);
  } catch (error) {
    console.log(`Unknown error occured: \n ${error}`.bgRed);
    res.status(500).send(`Server Error: 505
    
    \n ${error}`);
  }
};

module.exports = {
  getBlogs,
};
