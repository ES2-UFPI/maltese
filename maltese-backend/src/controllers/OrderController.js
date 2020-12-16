const Order = require("../models/Order");

module.exports = {
    async index (req, res) {
        let data = await Order.find();
        return res.status(200).send(data);
    },
    async create (req, res) {
        const { client, provider, items } = req.body;
        if (!client || !provider || !items) {
            return res.status(401).send({error: "Invalid request parameters!"});
        }        
        let order = await Order.findOne({client, provider});
        if (order) {
            return res.status(403).send({error: "Order already exists!"});
        }
        const created_order = await Order.create({client, provider, items});
        return res.status(200).send(created_order);
    },
    async read(req, res) {
        const { client, provider } = req.body;
        if (!client || !provider) {
            return res.status(401).send({error: "Invalid request parameters!"});
        }
        let order = await Order.find({client, provider});
        if (!order) {
            return res.status(404).send({error: "Order not found!"});
        }
        return res.status(200).send({order});
    },
    async update(req, res) {
        const { client, provider, items } = req.body;
        if (!client || !provider || !items) {
            return res.status(401).send({error: "Invalid request parameters!"});
        }

        let order = await Order.findOneAndUpdate({client, provider}, {items}, {new: true})
        if(!order) {
            return res.status(404).send({error: "Order not found"});
        }

        return res.status(200).send(order);
    },
    async delete(req, res) {
        const { client, provider } = req.body;
        if (!client || !provider) {
            return res.status(401).send({error: "Invalid request parameters!"});
        }
        let removed = await Order.findOneAndDelete({client, provider});

        return res.status(200).send({removed});
    }
};
