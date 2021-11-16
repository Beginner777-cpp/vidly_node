require('express-async-errors');
const winston = require('winston');
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const mongoose = require("mongoose");
const startUpDebugger = require("debug")("app:startUp");
const dbDebugger = require("debug")("app:db");
const logger = require("./middleware/logger");
const genres = require("./routes/genres");
const home = require("./routes/home");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error');
const PORT = process.env.PORT || 3000;
const app = express();

winston.add(winston.transports.File, {filename: 'logfile.log'});

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
// app.use(logger);
app.set("view engine", "pug");
app.set("views", "./views"); //default
console.log(app.get("env"));
if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startUpDebugger("Morgan enabled");
}



mongoose
  .connect("mongodb://localhost:27017/vidly")
  .then(() => console.log("Connected to database..."))
  .catch((err) => console.log(err));

app.use("/api/genres", genres);
app.use("/", home);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);
app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));
