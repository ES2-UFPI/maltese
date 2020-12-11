const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Client", ClientSchema);
