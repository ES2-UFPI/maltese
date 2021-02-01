const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
    retrieve_chat: [
        {
            sender: Number,
            message: String,
            date: { type: Date, default: Date.now }
        }
    ],
    deliver_chat: [
        {
            sender: Number,
            message: String,
            date: { type: Date, default: Date.now }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Conversation", ConversationSchema);