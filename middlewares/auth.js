const User = require("../models/user");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) { //if token is not present in cookies
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decoded = await jwt.verify(token, secret);  //verifying token
    req.user = await User.findById(decoded._id);  //setting user to req.user
    next();

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
