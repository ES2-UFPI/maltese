const Client = require("../models/Client");
const Provider = require("../models/Provider");

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

        let client = await Client.findOne({ user });

        if (!client) {
            client = await Product.create({ name, user });
        } else {
            return res.status(403).send({ error: "Client already exists!" });
        }

        return res.status(201).json(client);
    },

    async read(req, res) {
        const { client_id } = req.params;

        let client = await Client.findById({ client_id });

        if (!client) {
            return res.status(403).send({ error: "Client not found!" });
        }
        return res.status(200).json(client);
    },

    async update(req, res) {
        const { client_id } = req.params;
        const { name } = req.body;

        let client = await Client.findByIdAndUpdate(
            client_id,
            { name },
            { new: true }
        );

        if(!client) {
            return res.status(403).send({ error: "Client not found!" });
        }
        return res.status(200).json(client);
    },
    
    async delete(req, res) {
        const { client_id } = req.params;

        let client = await Client.findById(client_id);

        if(!client) {
            return res.status(403).send({ error: "Client not found!" });
        }
        
        await client.deleteOne();

        return res.sendStatus(204);
    },

    async indexProductsStore(req, res) {
        const { provider_id } = req.params;

        const provider = await Provider.findById(provider_id);

        const allProducts = provider.products;

        return res.status(200).json(allProducts);
    },
};
