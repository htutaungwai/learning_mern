const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const colors = require("colors");

//  @desc      POST  *** REGISTER USER ***
//  @route     '/api/users/register'
//  @access    Public

const registerUser = async (req, res, next) => {
  try {
    let toasts = [];
    const { firstName, lastName, email, password } = req.body;

    if (!firstName)
      toasts.push({ message: "First name is required", type: "error" });

    if (!lastName)
      toasts.push({ message: "Last name is required", type: "error" });

    if (!password) {
      toasts.push({ message: "A valid password is needed", type: "error" });
    }

    if (password.includes(" ")) {
      toasts.push({
        message: "Spaces in password are not allowed.",
        type: "error",
      });
    }

    if (!containNumber(password)) {
      toasts.push({
        message: "Password must contain at least 1 number.",
        type: "error",
      });
    }

    if (!containSpecialCharacter(password)) {
      toasts.push({
        message: "Password must contain at least 1 special character.",
        type: "error",
      });
    }

    if (password && (password.length < 6 || password.length > 12)) {
      toasts.push({
        message: "Password must be at least 6 - 12 characters long",
        type: "error",
      });
    }

    if (!email || !validatedEmail(email))
      toasts.push({ message: "A valid email is required", type: "error" });

    // if there are any errors in toasts array
    if (toasts.length > 0) return res.status(400).json(toasts);

    // checking whether if a user has already been singed up or not...
    let newUser = await User.findOne({ email });
    if (newUser) {
      return res.status(400).json([
        {
          message: "User already exists",
          type: "error",
        },
      ]);
    }

    newUser = new User(req.body);

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    await newUser.save();

    const payload = {
      user: {
        id: newUser._id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: 28800,
      },
      (err, token) => {
        if (err) throw err;
        res.json(token);
      }
    );
  } catch (error) {
    console.log(`Unknown error occured: \n ${error}`.bgRed);
    res.status(500).send(`Server Error: 505
    \n ${error}`);
  }
};

//  @desc      POST  *** LOGIN USER ***
//  @route     '/api/users/register'
//  @access    Public

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let toasts = [];

    if (!password)
      toasts.push({ message: "A valid password is needed.", type: "error" });

    if (password && (password.length < 6 || password.length > 12)) {
      toasts.push({
        message: "Password must be at least 6 - 12 characters long",
        type: "error",
      });
    }
    if (!email || !validatedEmail(email))
      toasts.push({ message: "A valid Email is needed", type: "error" });

    if (toasts.length > 0) return res.status(400).json(toasts);

    let user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "User does not exist", type: "error" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        type: "error",
      });
    }

    const payload = {
      user: {
        id: user._id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: 28800,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token, payload });
      }
    );
  } catch (error) {
    console.error(`Error: ${error.message}`.bgRed.underline.bold);
    res.status(500).send("Server Error");
  }
};

//  @desc      Get user profile
//  @route     '/api/users/profile
//  @access    Private
const getProfile = async (req, res) => {
  try {
    const userId = req.body.user.id;

    if (!userId) {
      res.status(400).json({ message: "something went worng" });
    }

    const user = await User.findById(userId)
      .select("-password")
      .select("-createdAt")
      .select("-updatedAt");
    if (!user)
      return res
        .status(404)
        .json({ message: "User does not exist", type: "error" });

    res.json(user);
  } catch (error) {
    console.error(`Error: ${error.message}`.bgRed.underline.bold);
    res.status(500).send("Something went wrong");
  }
};

function containSpecialCharacter(password) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  return specialChars.test(password);
}

function containNumber(password) {
  return /\d/.test(password);
}

function validatedEmail(email) {
  const regex = /\S+@\S+\.\S+/;
  // validating email...
  return regex.test(email);
}

module.exports = {
  registerUser,
  getProfile,
  loginUser,
};
