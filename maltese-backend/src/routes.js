const express = require("express");

const ClientControllers = require("./controllers/ClientControllers");
const ProductContollers = require("./controllers/ProductControllers");
const ProviderController = require("./controllers/ProviderControllers");

const routes = express.Router();

routes.get("/clients/:provider_id", ClientControllers.showProductsStore);

routes.post("/products", ProductContollers.store);
routes.get("/products", ProductContollers.index);
routes.put("/products/:product_id", ProductContollers.update);
routes.delete("/products/:product_id", ProductContollers.delete);

// Provider Routes
routes.get("/provider/list", ProviderController.index);
routes.get("/provider", ProviderController.read);
routes.post("/provider", ProviderController.create);
routes.put("/provider", ProviderController.update);
routes.delete("/provider", ProviderController.delete);

module.exports = routes;
