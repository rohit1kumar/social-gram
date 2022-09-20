const mongoose = require("mongoose");
const User = require("../models/user");

exports.connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI) //connect to mongodb
    .then(() => {
      console.log(`Database Connected`);
      return User.syncIndexes();
    }).then(() => {
      console.log(`Database Indexs Synced`);
    })
    .catch((err) => console.log(err));
};
