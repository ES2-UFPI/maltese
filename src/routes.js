const routes = require("express").Router();
const multer = require("multer");

const uploadConfig = require("./config/upload");
const UserControllers = require("./controllers/UserControllers");
const ClientControllers = require("./controllers/ClientControllers");
const ProviderControllers = require("./controllers/ProviderControllers");
const DeliverymanControllers = require("./controllers/DeliverymanControllers");
const ProductContollers = require("./controllers/ProductControllers");
const OrderControllers = require("./controllers/OrderControllers");
const DeliveryControllers = require("./controllers/DeliveryControllers");
const ConfirmationController = require("./controllers/ConfirmationController");

const upload = multer(uploadConfig);

// User routes
routes
    .get("/users", UserControllers.index)
    .get("/users/:user_id", UserControllers.read)
    .post("/users", UserControllers.create)
    .put("/users/:user_id", UserControllers.update)
    .delete("/users/:user_id", UserControllers.delete);

// Client Routes
routes
    .get("/clients", ClientControllers.index)
    .get("/clients/:client_id", ClientControllers.read)
    .post("/clients", ClientControllers.create)
    .put("/clients/:client_id", ClientControllers.update)
    .delete("/clients/:client_id", ClientControllers.delete)
    .get("/clients/:cliend_id/search/:name", ClientControllers.search);

// Provider Routes
routes
    .get("/providers", ProviderControllers.index)
    .get("/providers/:provider_id", ProviderControllers.read)
    .post("/providers", ProviderControllers.create)
    .put("/providers/:provider_id", ProviderControllers.update)
    .delete("/providers/:provider_id", ProviderControllers.delete)
    .post("/providers/:provider_id/addProducts", ProviderControllers.addProducts)
    .get(
        "/providers/:provider_id/showProducts",
        ProviderControllers.showProducts
    )
    .delete(
        "/providers/:provider_id/removeProduct",
        ProviderControllers.removeProduct
    )
    .get("/providers/:provider_id/showOrders", ProviderControllers.showOrders);

// Deliveryman Routes
routes
    .get("/deliverymen", DeliverymanControllers.index)
    .get("/deliverymen/:deliveryman_id", DeliverymanControllers.read)
    .post("/deliverymen", DeliverymanControllers.create)
    .put("/deliverymen/:deliveryman_id", DeliverymanControllers.update)
    .delete("/deliverymen/:deliveryman_id", DeliverymanControllers.delete);

// Product Routes
routes
    .get("/products", ProductContollers.index)
    .get("/products/:product_id", ProductContollers.read)
    .post("/products", upload.single("image"), ProductContollers.create)
    .put("/products/:product_id", ProductContollers.update)
    .delete("/products/:product_id", ProductContollers.delete);

// Order Routes
routes
    .get("/orders", OrderControllers.index)
    .get("/orders/:order_id", OrderControllers.read)
    .post("/orders", OrderControllers.create)
    .put("/orders/:order_id", OrderControllers.update)
    .delete("/orders/:order_id", OrderControllers.delete);

// Delivery Routes
routes
    .get("/deliveries", DeliveryControllers.index)
    .get("/deliveries/:order", DeliveryControllers.read)
    .post("/deliveries", DeliveryControllers.create)
    .put("/deliveries/:delivery_id", DeliveryControllers.update)
    .delete("/deliveries/:delivery_id", DeliveryControllers.delete);

routes
    .post("/confirm", ConfirmationController.confirm);

module.exports = routes;
