const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client"
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Provider"
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    createAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Order", OrderSchema);
