const express = require('express');
const helmet = require("helmet");
const morgan = require("morgan");
const dbDebugger = require("debug")("app:db");
const startUpDebugger = require("debug")("app:startUp");
const logger = require("../middleware/logger");
const genres = require("../routes/genres");
const home = require("../routes/home");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');
module.exports = function (app) {
    if (app.get("env") === "development") {
        app.use(morgan("tiny"));
        startUpDebugger("Morgan enabled");
    }

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static("public"));
    app.use(helmet());
    // app.use(logger);
    app.set("view engine", "pug");
    app.set("views", "../views"); //default

    app.use("/api/genres", genres);
    app.use("/", home);
    app.use("/api/customers", customers);
    app.use("/api/movies", movies);
    app.use("/api/rentals", rentals);
    app.use("/api/users", users);
    app.use("/api/auth", auth);
    app.use(error);
}