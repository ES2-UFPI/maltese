const express = require("express");

const routes = express.Router();

routes.get("/index", (req, res) => res.send("<h1>Hello World</h1>"));

module.exports = routes;