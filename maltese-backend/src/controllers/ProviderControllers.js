const Provider = require("../models/Provider");

module.exports = {
    async index(req, res) {
        // Retrieve all registered providers
        const providers = await Provider.find();

        return res.status(200).json(providers);
    },

    async create(req, res) {
        // Check parameters validity
        const { name, user } = req.body;

        if (!name || !user) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        // Check if the registering provider doesn't exists
        const existing_provider = await Provider.findOne({ user });
        if (existing_provider) {
            return res.status(403).send({ error: "Provider already exists!" });
        }

        // Create the provider
        const created_provider = await Provider.create({ name, user });
        if (!created_provider) {
            return res
                .status(500)
                .send({ error: "Failed to create provider!" });
        }

        return res.status(201).json(created_provider);
    },

    async read(req, res) {
        // Check parameters validity
        const { provider_id } = req.params;

        // Check if the registering provider exists
        const existing_provider = await Provider.findById(provider_id);

        if (!existing_provider) {
            return res.status(404).send({ error: "Provider not found!" });
        }

        return res.status(200).json(existing_provider);
    },

    async update(req, res) {
        // Check parameters validity
        const { provider_id } = req.params;
        const { name, products } = req.body;

        if (!name) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        // Check if the registering provider exists
        let provider = await Provider.findByIdAndUpdate(
            provider_id,
            { name, products },
            { new: true }
        );
        if (!provider) {
            return res.status(404).send({ error: "Provider not found!" });
        }

        return res.status(200).json(provider);
    },

    async delete(req, res) {
        // Check parameters validity
        const { provider_id } = req.params;

        let provider = await Provider.findById(provider_id);

        if (!provider) {
            return res.status(404).send({ error: "Provider not found!" });
        }

        await provider.delete();

        return res.sendStatus(204);
    },
};
