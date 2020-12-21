const User = require("../models/User");
const Client = require("../models/Client");
const Deliverer = require("../models/Deliverer");
const Order = require("../models/Order");
const Delivery = require("../models/Delivery");

// Processes
const DeliveryProcessExample = require("./DeliveryProcesses/DeliveryProcessExample")

module.exports = {
    async index(req, res) {
        const deliveries = Delivery.find();
        return deliveries;
    },

    async create(req, res) {
        const {client_id, deliverer_id, order_id} = req.body;

        // Check existing client
        const existingDelivery = await Delivery.findOne({client_id, deliverer_id, order_id});
        if (existingDelivery) {
            res.status(403).send({error: "Existing delivery!"});
        }

        // Check provided client-id
        const existingClient = await Client.findById(client_id);
        if (!existingClient) {
            res.status(404).send({error: "Provided client not found!"});
        }

        // Check provided deliverer-id
        const existingDeliverer = await Deliverer.findById(deliverer_id);
        if (!existingDeliverer) {
            res.status(404).send({error: "Provided deliverer not found!"});
        }

        // Check provided order-id
        const existingOrder = await Order.findById(order_id);
        if (!existingOrder) {
            res.status(404).send({error: "Provided order not found!"});
        }

        // Apply process item
        deliveryBody = {client_id, deliverer_id, order_id};
        data = DeliveryProcessExample.test_example(deliveryBody);

        // Create deliverer
        const delivery = await Delivery.create(data);
        if (!delivery) {
            res.status(501).send({error: "Failed to create deliverer!"});
        }

        return res.status(201).json(delivery);
    },

    async read(req, res) {
        const {client_id, order_id} = req.body;

        // Check existing
        const existingDelivery = await Delivery.findOne({client_id, order_id});
        if (!existingDelivery) {
            res.status(403).send({error: "Delivery doesn't exists!"});
        }

        res.status(200).send(existingDelivery);
    },

    async update(req, res) {
        const {client_id, order_id, status} = req.body;

        // Check existing
        const existingDelivery = await Delivery.findOne({client_id, order_id});
        if (!existingDelivery) {
            res.status(403).send({error: "Delivery doesn't exists!"});
        }

        const updatedDelivery = await Delivery.updateOne({client_id, order_id, status});
        if (!updatedDelivery) {
            res.status(501).send({error: "Failed to update delivery!"});
        }

        res.status(200).send(updatedDelivery);
    },

    async delete(req, res) {
        const {client_id, deliverer_id, order_id} = req.body;

        // Check existing
        const existingDelivery = await Delivery.findOne({client_id, deliverer_id, order_id});
        if (!existingDelivery) {
            res.status(403).send({error: "Delivery doesn't exists!"});
        }

        const deletedDeliveries = await Delivery.deleteMany({client_id, deliverer_id, order_id});

        res.status(200).send(deletedDeliveries);
    },
};
