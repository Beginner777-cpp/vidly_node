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
const PORT = process.env.PORT || 3000;
const app = express();

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

const connection = mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to database..."))
  .catch((err) => console.log(err));

app.use("/api/genres", genres);
app.use("/", home);
app.use("/api/customers", customers);

app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));
