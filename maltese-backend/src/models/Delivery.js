const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
    },
    deliverer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Deliverer",
        required: true,
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    status: {
        type: String,
        enum: ['CONFIRMED', 'READY', 'TRANSIT', 'DONE', 'FAILED'],
        default: 'CONFIRMED',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Delivery", DeliverySchema);
