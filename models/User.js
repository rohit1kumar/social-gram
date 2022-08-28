const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },

  avatar: {
    public_id: String,  // public_id is the id of the image uploaded to cloudinary
    url: String,    // url is the url of the image uploaded to cloudinary
  },

  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "Email already exists"],
    select: false,
  },

  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId, //references to user model
      ref: "post",
    },
  ],

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId, //references to user model
      ref: "user",
    },
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId, //references to user model
      ref: "user",
    },
  ]
});

//  hashing password before saving to database
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {  //if password is modified then hash it
    this.password = await bcrypt.hash(this.password, 10); //10 is the number of rounds of hashing algorithm or salt
  }
  next();
});

// comparing password with hashed password in database
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generating token for user
userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

module.exports = mongoose.model("user", userSchema);
