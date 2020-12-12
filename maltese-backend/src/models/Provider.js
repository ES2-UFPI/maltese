const mongoose = require("mongoose");

const ProviderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        quantity: Number
    }],
    createAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Provider", ProviderSchema);