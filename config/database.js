const mongoose = require("mongoose");

exports.connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI) //connect to mongodb
    .then((con) => console.log(`Database Connected`)) 
    .catch((err) => console.log(err));
};
