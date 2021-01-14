const Order = require("../models/Order");

module.exports = {
    async index(req, res) {
        const orders = await Order.find();

        return res.status(200).json(orders);
    },

    async create(req, res) {
        const { client, provider, items, status } = req.body;

        if (!client || !provider || !items) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        const existing_order = await Order.findOne({ client, items, status });
        if (existing_order) {
            return res.status(403).send({ error: "Order already exists!" });
        }

        const order = await Order.create({
            client,
            provider,
            items,
            status,
        });
        if (!order) {
            return res.status(500).send({ error: "Failed to create order!" });
        }

        return res.status(201).json(order);
    },

    async read(req, res) {
        const { order_id } = req.params;

        const order = await Order.findById(order_id);

        if (!order) {
            return res.status(404).send({ error: "Order not found!" });
        }

        return res.status(200).json(order);
    },

    async update(req, res) {
        const { order_id } = req.params;
        const { client, provider, items, status } = req.body;

        if (!client || !provider || !items || !status) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        let order = await Order.findByIdAndUpdate(
            order_id,
            { client, provider, items, status },
            { new: true }
        );
        if (!order) {
            return res.status(404).send({ error: "Order not found" });
        }

        return res.status(200).json(order);
    },

    async delete(req, res) {
        const { order_id } = req.params;

        const order = await Order.findById(order_id);

        if (!order) {
            return res.status(404).send({ error: "Order not found" });
        }

        await order.delete();

        return res.sendStatus(204);
    },
};
