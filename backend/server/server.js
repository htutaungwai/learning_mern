const express = require("express");
const colors = require("colors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
require("dotenv").config();

// express app
const app = express();
app.use(express.json({ extended: false }));

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `MonogDB Connected: ${con.connection.host}`.cyan.underline.bold
    );
  } catch (error) {
    console.log(`Error: ${error.message}`.bgRed.underline.bold);
    process.exit(1);
  }
};

connectDB();

app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`.green.bgCyan.bold);
});
