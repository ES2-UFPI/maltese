const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Provider",
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: Number,
        },
    ],
    status: {
        type: Number,
        required: true,
        default: 0,
    },
    address: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Order", OrderSchema);
