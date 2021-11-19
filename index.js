require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
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

// process.on('uncaughtException', (ex) => {
//   // console.log("uncaughtException");
//   winston.error(ex.message);
//   process.exit(1);
// })
// winston.ExceptionHandler
new winston.ExceptionHandler(
  new winston.transports.File({filename: 'uncaughtException.log'})
)

process.on('unhandledRejection', (ex) => {
  // console.log("unhandledRejection");
  winston.error(ex.message);
  process.exit(1);

})


// winston.add(new winston.transports.File({ filename: 'logfile.log' }), { 'timestamp': true });
function timezoned() {
  return `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()} T ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
}
winston.add(winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: timezoned }),
    winston.format.json()
  ),

  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'logfile.log' }),

  ],
}));

winston.add(new winston.transports.MongoDB({ db: "mongodb://localhost:27017/vidly", options: { useNewUrlParser: true, useUnifiedTopology: true } }))


// throw new Error('Something failed');

// const p = Promise.reject(new Error('miserable error.'));

// p.then(() => console.log('Done'))


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
