const express = require("express");

const ClientControllers = require("./controllers/ClientControllers");
const ProductContollers = require("./controllers/ProductControllers");
const ProviderController = require("./controllers/ProviderControllers");
const UserControllers = require("./controllers/UserControllers");

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

// User routes
routes.get("/user/list", UserControllers.index);
routes.get("/user", UserControllers.read);
routes.post("/user", UserControllers.create);
routes.put("/user", UserControllers.update);
routes.delete("/user", UserControllers.delete);

module.exports = routes;
