const express = require("express");
const app = express();

require("dotenv").config({ path: "config/config.env" });
const cookieParser = require("cookie-parser");
const helmet = require('helmet');

const { connectDatabase } = require("./config/database");

// Importing Routes
const post = require("./routes/post");
const user = require("./routes/user");
const notFound = require("./utils/notFound");

// Using Middlewares
app.use(helmet());
app.use(express.json({ limit: "50mb" }));   // Parsing JSON
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Parsing URL
app.use(cookieParser());

// Using Routes
app.use("/api/v1", post);
app.use("/api/v1", user);
app.use(notFound);  //to handle 404 error

//connecting db
connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
