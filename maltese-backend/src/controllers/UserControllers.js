const User = require("../models/User");

module.exports = {
    async index (req, res) {
        let data = await User.find();

        console.log("Output Index content:");
        console.log(data);

        return res.status(200).send(data);
    },
    async create (req, res) {
        const { login, password } = req.body;

        console.log("Output Body Request content:");
        console.log(req.body);

        if (!login || !password) {
            return res.status(401).send({error: "Invalid request parameters!"});
        }
        let existing_user = await User.findOne({login, password});

        console.log("Output Existing User content:");
        console.log(existing_user);

        if (existing_user) {
            return res.status(403).send({error: "User already exists!"});
        }
        const created_user = await User.create({login, password});
        
        console.log("Output Created User content:");
        console.log(req.body);

        return res.status(200).send(created_user);
    },
    async read(req, res) {
        const { login } = req.body;

        console.log("Output Request Body content:");
        console.log(req.body);

        if (!login) {
            return res.status(401).send({error: "Invalid request parameters!"});
        }
        let existing_user = await User.findOne({login});

        console.log("Output Existing User content:");
        console.log(req.body);

        if (!existing_user) {
            return res.status(403).send({error: "User not found!"});
        }
        return res.status(200).send({existing_user});
    },
    async update(req, res) {
        const { login, password } = req.body;

        console.log("Output Request Body content:");
        console.log(req.body);

        if (!login || !password) {
            return res.status(401).send({error: "Invalid request parameters!"});
        }
        let user = await User.findOneAndUpdate({login}, {password}, {new: true})
        if(!user) {
            return res.status(400).send({error: "User not found"});
        }

        console.log("Output User (post-update) content:");
        console.log(user);

        return res.status(200).send(user);
    },
    async delete(req, res) {
        const { login } = req.body;

        console.log("Output Request Body content:");
        console.log(req.body);

        if (!login) {
            return res.status(401).send({error: "Invalid request parameters!"});
        }
        let removed = await User.findOneAndDelete({login});

        console.log("Output Removed content:");
        console.log(removed);

        return res.status(200).send({removed});
    }
};
