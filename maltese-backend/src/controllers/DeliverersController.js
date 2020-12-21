const User = require("../models/User");
const Deliverer = require("../models/Deliverer");

module.exports = {
    async index(req, res) {
        const deliverers = Deliverer.find();
        return deliverers;
    },

    async create(req, res) {
        const {name, user_id} = req.body;

        // Check existing deliverer
        const existingDeliverer = await Deliverer.findOne({user_id});
        if (existingDeliverer) {
            res.status(403).send({error: "Existing deliverer!"});
        }

        // Check provided user-id
        const existingUser = await User.findById(user_id);
        if (!existingUser) {
            res.status(404).send({error: "Provided user not found!"});
        }

        // Create deliverer
        const deliverer = await Deliverer.create({name, user_id});
        if (!deliverer) {
            res.status(501).send({error: "Failed to create deliverer!"});
        }

        return res.status(201).json(deliverer);
    },

    async read(req, res) {
        const {user_id} = req.body;

        // Check existing
        const existingDeliverer = await Deliverer.findOne({user_id});
        if (!existingDeliverer) {
            res.status(403).send({error: "Deliverer doesn't exists!"});
        }

        res.status(200).send(existingDeliverer);
    },

    async update(req, res) {
        const {user_id, name} = req.body;

        // Check existing
        const existingDeliverer = await Deliverer.findOne({user_id});
        if (!existingDeliverer) {
            res.status(403).send({error: "Deliverer doesn't exists!"});
        }

        const updatedDeliverer = await Deliverer.updateOne({user_id}, {name});
        if (!updatedDeliverer) {
            res.status(501).send({error: "Failed to update deliverer!"});
        }

        res.status(200).send(updatedDeliverer);
    },

    async delete(req, res) {
        const {user_id} = req.body;

        // Check existing
        const existingDeliverer = await Deliverer.findOne({user_id})
        if (!existingDeliverer) {
            res.status(403).send({error: "Deliverer doesn't exists!"});
        }

        const deletedDeliverers = await Deliverer.deleteMany({user_id});

        res.status(200).send(deletedDeliverers);
    },
};
