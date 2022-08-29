const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  caption: String,    // caption of the post

  image: {
    public_id: String,  // public_id is the id of the image uploaded to cloudinary
    url: String,      // url is the url of the image uploaded to cloudinary
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId, //references to user model
    ref: "user",

  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId, //references to user model
      ref: "user",
    },
  ],

  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId, //references to user model
        ref: "user",
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});
const post = mongoose.model("post", postSchema);
module.exports = post;
