const Blog = require("../models/Blog");
const colors = require("colors");

// @desc    GET all blog by user id
// @route   "/api/blogs"
// @access  Private

const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ user: req.user.id });
    res.json(blogs);

    // res.json(req.user);
  } catch (error) {
    console.log(`Unknown error occured: \n ${error}`.bgRed);
    res.status(500).send(`Server Error: 505
    
    \n ${error}`);
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newBlog = new Blog({
      title,
      content,
      user: req.user.id,
    });

    await newBlog.save();

    if (!newBlog)
      res
        .status(400)
        .json([{ message: "blog is not created.", type: "error" }]);
    res.json(newBlog);
  } catch (error) {
    console.error(`Error: ${error.message}`.bgRed.underline.bold);
    res.status(500).send("Server Error");
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title && !content)
      res.json({
        message: "Title or content need to be updated",
        type: "error",
      });

    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, content },
      { new: true }
    );
    res.json(blog);
  } catch (error) {
    console.error(`Error: ${error.message}`.bgRed.underline.bold);
    res.status(500).send("Server Error");
  }
};
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!blog) {
      res
        .status(400)
        .json([{ message: "cannot delete the blog", type: "error" }]);
      return;
    }

    res.status(200).json([
      {
        blogId: req.params.id,
        toasts: [{ message: "Blog deleted", type: "success" }],
      },
    ]);
  } catch (error) {
    console.error(`Error: ${error.message}`.bgRed.underline.bold);
    res.status(500).send("Server Error");
  }
};
module.exports = {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
};
