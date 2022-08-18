const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token)
    return res.status(401).json({ msg: "No token, authentication failed." });

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not vaild", type: "error" });
  }
};
