const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const { connectDatabase } = require("./config/database")
// const cloudinary = require("cloudinary")

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "config/config.env" })
}

//connecting db
connectDatabase()

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// })

// Using Middlewares
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))
app.use(cookieParser())


// Importing Routes
const post = require("./routes/post")
const user = require("./routes/user")

// Using Routes
app.use("/api/v1", post)
app.use("/api/v1", user)


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})

