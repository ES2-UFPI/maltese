const express = require("express");

const ClientControllers = require("./controllers/ClientControllers");
const ProductContollers = require("./controllers/ProductControllers");

const routes = express.Router();

routes.get("/clients/:provider_id", ClientControllers.showProductsStore);

routes.post("/products", ProductContollers.store);
routes.get("/products", ProductContollers.index);
routes.put("/products/:product_id", ProductContollers.update);
routes.delete("/products/:product_id", ProductContollers.delete);

module.exports = routes;
