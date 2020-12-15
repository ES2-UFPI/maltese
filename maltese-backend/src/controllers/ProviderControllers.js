const Provider = require("../models/Provider");

module.exports = {
    async index (req, res) {
        // Retrieve all registered providers
        const providers = await Provider.find();
        return res.status(200).send({providers: providers});
    },
    async create (req, res) {
        // Check parameters validity
        const {name, user} = req.body;
        
        // Check if the registering provider doesn't exists
        const existing_provider = await Provider.findOne({name, user});
        if (existing_provider) {
            return res.status(403).send({error: "Provider already exists"});
        }
        
        // Create the provider
        const provider = {
            name: name,
            user: user,
            products: []
        };
        const created_provider = await Provider.create(provider);
        if (!created_provider) {
            return res.status(500).send({error: "Failed to create provider"});    
        }

        return res.status(200).send(created_provider);
    },
    async read(req, res) {
        // Check parameters validity
        const {name, user} = req.body;
        
        // Check if the registering provider exists
        const existing_provider = await Provider.findOne({name, user});
        if (!existing_provider) {
            return res.status(404).send({error: "Provider not found"});
        }
        return res.status(200).send(existing_provider);
    },
    async update(req, res) {
        // Check parameters validity
        const {name, user} = req.body;
        
        // Check if the registering provider exists
        const existing_provider = await Provider.findOne({name, user});
        if (!existing_provider) {
            return res.status(404).send({error: "Provider not found"});
        }

        const updated_provider = await Provider.findOneAndUpdate({name, user}, {products}, {new: true});
        if (!updated_provider) {
            return res.status(500).send({error: "Failed to update provider"});
        }

        return res.status(200).send(updated_provider);
    },
    async delete(req, res) {
        // Check parameters validity
        const {name, user} = req.body;
        
        // Check if the registering provider exists
        const existing_provider = await Provider.deleteMany({name, user});
        if (!existing_provider) {
            return res.status(404).send({error: "Provider not found"});
        }

        return res.status(200).send(existing_provider);
    }
};
