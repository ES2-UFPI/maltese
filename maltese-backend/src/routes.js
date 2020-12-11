const express = require("express");

const ClientControllers = require("./controllers/ClientControllers");
const ProductContollers = require("./controllers/ProductControllers");

const routes = express.Router();

routes.get("/clients/:provider_id", ClientControllers.showProductsStore);

routes.post("/Product", ProductContollers.store);
routes.get("/Product", ProductContollers.index);
routes.put("/Product/:product_id", ProductContollers.update);
routes.delete("/Product/:product_id", ProductContollers.delete);

module.exports = routes;
