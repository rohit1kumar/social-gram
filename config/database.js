const mongoose = require("mongoose");
const User = require("../models/user");
const MONGO_IP = process.env.MONGO_IP || "mongo";
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_USER = process.env.MONGO_USER
const MONGO_PASSWORD = process.env.MONGO_PASSWORD

exports.connectDatabase = () => {
  mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}?authSource=admin`)
    .then(() => {
      console.log(`Database Connected`);
      return User.syncIndexes();
    }).then(() => {
      console.log(`Database Indexs Synced`);
    })
    .catch((err) => console.log(err));
};

/*
    MONGO_IP: process.env.MONGO_IP || 'mongo',
    MONGO_PORT: process.env.MONGO_PORT || 27017,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    REDIS_URL: process.env.REDIS_URL || 'redis',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    SESSION_SECRET: process.env.SESSION_SECRET

*/
