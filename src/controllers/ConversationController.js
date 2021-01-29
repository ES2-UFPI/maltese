const Conversation = require("../models/Conversation");

module.exports = {
    /**
     * Returns all conversations in the database
     */
    async index(req, res) {
        const conversations = await Conversation.find();
        return res.status(200).json(conversations);
    },

    /**
     * Create a conversation in the database
     * 
     * @param {Array} retrieve_chat req.body - Conversation array between provider and deliveryman
     * @param {Array} deliver_chat  req.body - Conversation array between deliveryman and client
     */
    async create(req, res) {
        const { retrieve_chat, deliver_chat } = req.body;
        if (!retrieve_chat || !deliver_chat) {
            return res.status(400).send({ error: "Invalid request parameters!" });
        }
        const conversation = await Conversation.create({retrieve_chat, deliver_chat});    
        if (!conversation) {
            return res.status(500).send({ error: "Failed to create conversation!" });
        }
        return res.status(201).json(conversation);
    },

    /**
     * Retrieve a conversation in the database
     */
    async read(req, res) {
        const { conversation_id } = req.params;
        if (!conversation_id) {
            return res.status(400).send({ error: "Invalid request parameters!" });
        }

        const conversation = await Conversation.findById(conversation_id);
        if (!conversation) {
            return res.status(404).send({ error: "Conversation not found!" });
        }

        return res.status(200).json(conversation);
    },

    /**
     * Updates a conversation in the database
     * 
     * @param {Mongo DB ID} conversation_id req.params - Conversation ID in database
     * @param {Array} retrieve_chat req.body - Conversation array between provider and deliveryman
     * @param {Array} deliver_chat  req.body - Conversation array between deliveryman and client
     */
    async update(req, res) {
        const { conversation_id } = req.params;
        const { retrieve_chat, deliver_chat } = req.body;

        if (!retrieve_chat || !deliver_chat) {
            return res.status(400).send({ error: "Invalid request parameters!" });
        }

        let conversation = await Conversation.findByIdAndUpdate(
            conversation_id,
            { retrieve_chat, deliver_chat },
            { new: true }
        );
        if (!conversation) {
            return res.status(404).send({ error: "Conversation not found!" });
        }

        return res.status(200).json(conversation);
    },

    /**
     * Deletes a conversation in the database
     * 
     * @param {Mongo DB ID} conversation_id req.params - Conversation ID in database
     */
    async delete(req, res) {
        const { conversation_id } = req.params;

        let conversation = await Conversation.findById(conversation_id);
        if (!conversation) {
            return res.status(404).send({ error: "Conversation not found!" });
        }

        await conversation.delete();
        return res.sendStatus(204);
    }
};