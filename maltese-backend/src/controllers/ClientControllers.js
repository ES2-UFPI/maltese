const Client = require("../models/Client");

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

        const created_client = await Client.create({ name, user });
        if (!created_client) {
            return res.status(500).send({ error: "Failed to create client!" });
        }

        return res.status(201).json(created_client);
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
};
