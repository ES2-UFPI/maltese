const Deliveryman = require("../models/Deliveryman");
const Delivery = require("../models/Delivery");

module.exports = {
    async index(req, res) {
        const deliverymen = await Deliveryman.find();

        return res.status(200).json(deliverymen);
    },

    async create(req, res) {
        const { name, user } = req.body;

        if (!name || !user) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        const existing_deliveryman = await Deliveryman.findOne({ user });
        if (existing_deliveryman) {
            return res
                .status(403)
                .send({ error: "Deliveryman already exists!" });
        }

        const deliveryman = await Deliveryman.create({ name, user });
        if (!deliveryman) {
            return res
                .status(500)
                .send({ error: "Failed to create Deliveryman!" });
        }

        return res.status(201).json(deliveryman);
    },

    async read(req, res) {
        const { deliveryman_id } = req.params;

        const deliveryman = await Deliveryman.findById(deliveryman_id);
        if (!deliveryman) {
            return res.status(404).send({ error: "Deliveryman not found!" });
        }

        return res.status(200).json(deliveryman);
    },

    async update(req, res) {
        const { deliveryman_id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        let deliveryman = await Deliveryman.findByIdAndUpdate(
            deliveryman_id,
            { name },
            { new: true }
        );
        if (!deliveryman) {
            return res.status(404).send({ error: "Deliveryman not found!" });
        }

        return res.status(200).json(deliveryman);
    },

    async delete(req, res) {
        const { deliveryman_id } = req.params;

        let deliveryman = await Deliveryman.findById(deliveryman_id);
        if (!deliveryman) {
            return res.status(404).send({ error: "Deliveryman not found!" });
        }

        await deliveryman.delete();

        return res.sendStatus(204);
    },
};
