const Client = require("../models/Client");
const Deliveryman = require("../models/Deliveryman");
const Order = require("../models/Order");
const Delivery = require("../models/Delivery");

// Processes Imports
const DeliveryProcessExample = require("./DeliveryProcesses/DeliveryProcessExample");

module.exports = {
    async index(req, res) {
        const deliveries = await Delivery.find();

        return res.status(200).json(deliveries);
    },

    async create(req, res) {
        const { client, deliveryman, order } = req.body;

        if (!client || !deliveryman || !order) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        const existing_delivery = await Delivery.findOne({
            client,
            deliveryman,
            order,
        });
        if (existing_delivery) {
            res.status(403).send({ error: "Delivery already exists!" });
        }

        const existing_client = await Client.findById(client);
        if (!existing_client) {
            res.status(404).send({ error: "Client not found!" });
        }

        const existing_deliverer = await Deliveryman.findById(deliveryman);
        if (!existing_deliverer) {
            res.status(404).send({ error: "Deliveryman not found!" });
        }

        const existing_order = await Order.findById(order);
        if (!existing_order) {
            res.status(404).send({ error: "Order not found!" });
        }

        // Apply process item
        //deliveryBody = { client, deliveryman, order };
        //data = DeliveryProcessExample.test_example(deliveryBody);

        const delivery = await Delivery.create({ client, deliveryman, order });
        if (!delivery) {
            res.status(501).send({ error: "Failed to create delivery!" });
        }

        return res.status(201).json(delivery);
    },

    async read(req, res) {
        const { order } = req.params;
        
        const delivery = await Delivery.findOne({ order });
        if (!delivery) {
            res.status(404).send({ error: "Delivery not found!" });
        }

        await delivery.populate("order").execPopulate();
        await delivery.populate("order.items.product").execPopulate();

        res.status(200).json(delivery);
    },

    async update(req, res) {
        const { delivery_id } = req.params;
        const { client, order, status } = req.body;

        if (!client || !order || !status) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        let delivery = await Delivery.findByIdAndUpdate(
            delivery_id,
            { client, order, status },
            { new: true }
        );
        if (!delivery) {
            res.status(404).send({ error: "Delivery not found!" });
        }

        return res.status(200).json(delivery);
    },

    async delete(req, res) {
        const { delivery_id } = req.params;

        const delivery = await Delivery.findById(delivery_id);
        if (!delivery) {
            return res.status(404).send({ error: "Delivery not found!" });
        }

        await delivery.delete();

        return res.sendStatus(204);
    },
};
