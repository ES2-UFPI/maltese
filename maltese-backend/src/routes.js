const routes = require("express").Router();
const multer = require("multer");

const uploadConfig = require("./config/upload");
const ClientControllers = require("./controllers/ClientControllers");
const ProductContollers = require("./controllers/ProductControllers");
const ProviderController = require("./controllers/ProviderControllers");
const UserControllers = require("./controllers/UserControllers");
const OrderController = require("./controllers/OrderController");

const upload = multer(uploadConfig);

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
    .put("/providers/:provider_id/addProducts", ProviderController.addProducts)
    .get(
        "/providers/:provider_id/showProducts",
        ProviderController.showProducts
    )
    .delete(
        "/providers/:provider_id/removeProduct",
        ProviderController.removeProduct
    )
    .get("/providers/:provider_id/showOrders", ProviderController.showOrders);

// Client Routes
routes
    .get("/clients", ClientControllers.index)
    .get("/clients/:client_id", ClientControllers.read)
    .post("/clients", ClientControllers.create)
    .put("/clients/:client_id", ClientControllers.update)
    .delete("/clients/:client_id", ClientControllers.delete);

// Product Routes
routes
    .get("/products", ProductContollers.index)
    .get("/products/:product_id", ProductContollers.read)
    .post("/products", upload.single("image"), ProductContollers.create)
    .put("/products/:product_id", ProductContollers.update)
    .delete("/products/:product_id", ProductContollers.delete);

// Order CRUD routes
routes
    .get("/orders", OrderController.index)
    .get("/orders/:order_id", OrderController.read)
    .post("/orders", OrderController.create)
    .put("/orders/:order_id", OrderController.update)
    .delete("/orders/:order_id", OrderController.delete);

module.exports = routes;
