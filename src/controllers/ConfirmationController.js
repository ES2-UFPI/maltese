const User = require("../models/User")
const Delivery = require("../models/Delivery")
const DeliveryControllers = require("./DeliveryControllers")

module.exports = {
    async confirm(req, res) {
        const {user_id, client_id, order_id, type} = req.body;

        const user = await User.findById({user_id});
        if (!user) {
            res.status(400).send({error: "Error"});
        }

        const delivery = await Delivery.findOne({client_id, order_id});
        if (!delivery) {
            res.status(400).send({error: "Error"});
        }

        const result = undefined;
        // Check if user is a client
        if (type == "Client") {
            req.body.status = 'DONE';
            result = await DeliveryControllers.update(req, res);
        }
        // Check if user is a deliverer
        else if (type == "Deliverer") {
            req.body.status = 'TRANSIT';
            result = await DeliveryControllers.update(req, res);
        }
        // Check if user is a provider
        else if (type == "Provider") {
            req.body.status = 'READY';
            result = await DeliveryControllers.update(req, res);
        }
        else {
            res.status(400).send({error: "Error"});
        }

        res.status(200).send({result: result});
    }
}