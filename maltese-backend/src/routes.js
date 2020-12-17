const routes = require("express").Router();

const ClientControllers = require("./controllers/ClientControllers");
const ProductContollers = require("./controllers/ProductControllers");
const ProviderController = require("./controllers/ProviderControllers");
const UserControllers = require("./controllers/UserControllers");
const OrderController = require("./controllers/OrderController");

// User routes
routes
    .get("/users", UserControllers.index)
    .get("/users/:user_id", UserControllers.read)
    .post("/users", UserControllers.create)
    .put("/users/:user_id", UserControllers.update)
    .delete("/users/:user_id", UserControllers.delete);

// Provider Routes
routes
    .get("/providers", ProviderController.index)
    .get("/providers/:provider_id", ProviderController.read)
    .post("/providers", ProviderController.create)
    .put("/providers/:provider_id", ProviderController.update)
    .delete("/providers/:provider_id", ProviderController.delete)
    .put("/providers/:provider_id/add", ProviderController.addProducts)
    .get("/providers/:provider_id/show", ProviderController.showProducts)
    .delete("/providers/:provider_id/remove", ProviderController.removeProduct);

// Client Routes
routes
    .get("/clients", ClientControllers.index)
    .get("/clients/:client_id", ClientControllers.read)
    .post("/clients", ClientControllers.create)
    .put("/clients/:client_id", ClientControllers.update)
    .delete("/clients/:client_id", ClientControllers.delete)
    .get("/client", ClientControllers.showStores)
    .get("/client/:provider_id", ClientControllers.showProductsStore);

// Product Routes
routes
    .get("/products", ProductContollers.index)
    .get("/products/:product_id", ProductContollers.read)
    .post("/products", ProductContollers.create)
    .put("/products/:product_id", ProductContollers.update)
    .delete("/products/:product_id", ProductContollers.delete);

// Order CRUD routes
routes.get("/order/list", OrderController.index);
routes.get("/order", OrderController.read);
routes.post("/order", OrderController.create);
routes.put("/order", OrderController.update);
routes.delete("/order", OrderController.delete);

module.exports = routes;
