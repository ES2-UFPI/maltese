const express = require("express");

const ClientControllers = require("./controllers/ClientControllers");

const routes = express.Router();

routes.get("/clients/:provider_id", ClientControllers.showProductsStore);

module.exports = routes;
