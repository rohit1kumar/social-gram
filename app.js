require("dotenv").config({ path: "config/config.env" });
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const { connectDatabase } = require("./config/database");


//connecting db
connectDatabase();

// Using Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());


// Importing Routes
const post = require("./routes/post");
const user = require("./routes/user");

// Using Routes
app.use("/api/v1", post);
app.use("/api/v1", user);


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
