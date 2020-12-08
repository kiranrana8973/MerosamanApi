const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const errorHandler = require("./middleware/customizederror");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize"); // for sql injection
const helmet = require("helmet");
const xss = require("xss-clean");
const path = require("path");
//const cors = require("cors");
// Load env file
dotenv.config({
  path: "./config/config.env",
});

// Connect to database
connectDB();

// Load routes files
const auth = require("./routes/auth");
const items = require("./routes/items");
const { urlencoded } = require("express");

// initialize out app variable with express
const app = express();

//Body parser , which allows to receive body data from postman
app.use(express.json());
app.use(express.urlencoded({urlencoded:true}))
app.use(cookieParser());
//app.use(cors());
// i want this only to run during development process not in production mode
if (process.env.NODE_ENV.trim() === "development") {
  app.use(morgan("dev"));
}

//File upload
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// prevent XSS Attacks
app.use(xss());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/item", items);

// To use the custom error message
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// In order to run the server we need to call listen
const server = app.listen(
  PORT,
  console.log(
    `Server running in mode : ${process.env.NODE_ENV},on port : ${PORT}`.yellow
      .bold
  )
);

//Handle unhandled promise rejections , change the password in the env file and check it will throw error message. it may take some time
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error connecting database : ${err.message}`.red);
  //close server and exit process
  server.close(() => process.exit(1));
});
