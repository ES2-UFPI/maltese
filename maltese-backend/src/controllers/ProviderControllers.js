const Provider = require("../models/Provider");
const Order = require("../models/Order");

module.exports = {
    async index(req, res) {
        const providers = await Provider.find();

        return res.status(200).json(providers);
    },

    async create(req, res) {
        const { name, user } = req.body;

        if (!name || !user) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        const existing_provider = await Provider.findOne({ user });
        if (existing_provider) {
            return res.status(403).send({ error: "Provider already exists!" });
        }

        const created_provider = await Provider.create({ name, user });
        if (!created_provider) {
            return res
                .status(500)
                .send({ error: "Failed to create provider!" });
        }

        return res.status(201).json(created_provider);
    },

    async read(req, res) {
        const { provider_id } = req.params;

        const existing_provider = await Provider.findById(provider_id);

        if (!existing_provider) {
            return res.status(404).send({ error: "Provider not found!" });
        }

        return res.status(200).json(existing_provider);
    },

    async update(req, res) {
        const { provider_id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        const provider = await Provider.findByIdAndUpdate(
            provider_id,
            { name },
            { new: true }
        );
        if (!provider) {
            return res.status(404).send({ error: "Provider not found!" });
        }

        return res.status(200).json(provider);
    },

    async delete(req, res) {
        const { provider_id } = req.params;

        const provider = await Provider.findById(provider_id);

        if (!provider) {
            return res.status(404).send({ error: "Provider not found!" });
        }

        await provider.delete();

        return res.sendStatus(204);
    },

    async addProducts(req, res) {
        const { provider_id } = req.params;
        const { products } = req.body;

        if (!products) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        const clearProducts = [...products];

        const provider = await Provider.findByIdAndUpdate(
            provider_id,
            { $push: { products: { $each: clearProducts } } },
            { new: true }
        );

        if (!provider) {
            return res.status(404).send({ error: "Provider not found!" });
        }

        return res.status(200).json(provider.products);
    },

    async showProducts(req, res) {
        const { provider_id } = req.params;

        const provider = await Provider.findById(provider_id);
        if (!provider) {
            return res.status(404).send({ error: "Provider not found!" });
        }

        return res.status(200).json(provider.products);
    },

    async removeProduct(req, res) {
        const { provider_id } = req.params;
        const { product } = req.body;

        const provider = await Provider.findByIdAndUpdate(
            provider_id,
            { $set: { products: { product: product, status: "archived" } } },
            { new: true }
        );

        if (!provider) {
            return res.status(404).send({ error: "Provider not found!" });
        }

        return res.status(200).json(provider.products);
    },

    async showOrders(req, res) {
        const { provider_id } = req.params;

        const orders = await Order.find({ provider: provider_id });

        return res.status(200).json(orders);
    },
};
