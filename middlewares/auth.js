const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    // console.log(decoded._id);
    req.user = await User.findById(decoded._id);
    // req.user = decoded._id;
    // console.log(req.user);
    next();

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
