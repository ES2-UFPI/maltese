const User = require("../models/User");

module.exports = {
    async index(req, res) {
        const users = await User.find();

        return res.status(200).json(users);
    },

    async create(req, res) {
        const { login, password } = req.body;

        if (!login || !password) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        const existing_user = await User.findOne({ login });
        if (existing_user) {
            return res.status(403).send({ error: "User already exists!" });
        }

        const user = await User.create({ login, password });
        if (!user) {
            return res.status(500).send({ error: "Failed to create user!" });
        }

        return res.status(201).json(user);
    },

    async read(req, res) {
        const { user_id } = req.params;

        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).send({ error: "User not found!" });
        }

        return res.status(200).json(user);
    },

    async update(req, res) {
        const { user_id } = req.params;
        const { login, password } = req.body;

        if (!login || !password) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        let user = await User.findByIdAndUpdate(
            user_id,
            { login, password },
            { new: true }
        );
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        return res.status(200).json(user);
    },

    async delete(req, res) {
        const { user_id } = req.params;

        let user = await User.findById(user_id);

        if (!user) {
            return res.status(404).send({ error: "User not found!" });
        }

        await user.delete();

        return res.sendStatus(204);
    },
};
