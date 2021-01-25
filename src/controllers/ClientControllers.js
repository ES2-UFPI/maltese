const Client = require("../models/Client");
const Product = require("../models/Product");
const Order = require("../models/Order");

module.exports = {
    async index(req, res) {
        const clients = await Client.find();

        return res.status(200).json(clients);
    },

    async create(req, res) {
        const { name, user } = req.body;

        if (!name || !user) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        const existing_client = await Client.findOne({ user });
        if (existing_client) {
            return res.status(403).send({ error: "Client already exists!" });
        }

        const client = await Client.create({ name, user });
        if (!client) {
            return res.status(500).send({ error: "Failed to create client!" });
        }

        return res.status(201).json(client);
    },

    async read(req, res) {
        const { client_id } = req.params;

        const client = await Client.findById(client_id);
        if (!client) {
            return res.status(404).send({ error: "Client not found!" });
        }

        return res.status(200).json(client);
    },

    async update(req, res) {
        const { client_id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        let client = await Client.findByIdAndUpdate(
            client_id,
            { name },
            { new: true }
        );
        if (!client) {
            return res.status(404).send({ error: "Client not found!" });
        }

        return res.status(200).json(client);
    },

    async delete(req, res) {
        const { client_id } = req.params;

        let client = await Client.findById(client_id);
        if (!client) {
            return res.status(404).send({ error: "Client not found!" });
        }

        await client.delete();

        return res.sendStatus(204);
    },

    async search(req, res) {
        function capitalizeName(name) {
            return name.replace(/\b(\w)/g, (s) => s.toUpperCase());
        }

        const { name } = req.params;
        const clearName = capitalizeName(name.toLowerCase());

        const products = await Product.find({ name: { $regex: clearName } });

        return res.status(200).json(products);
    },

    async history(req, res) {
        const { client_id } = req.params;

        const orders = await Order.find({ client: client_id }).populate({
            path: "items.product",
        });

        const finishedOrders = [];
        orders.map((order) => {
            if (order.status === 3 || order.status === -1) {
                finishedOrders.push(order);
            }
        });

        function recenteParaMaisAntigo(a, b) {
            return b.createdAt - a.createdAt;
        }
        finishedOrders.sort(recenteParaMaisAntigo);

        return res.status(200).json(finishedOrders);
    },
};
