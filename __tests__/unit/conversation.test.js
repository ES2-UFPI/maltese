const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../src/app");
const Conversation = require("../../src/models/Conversation");

/**
 * Subset of Conversation tests which contain only plain requests,
 * with no post-verification.
 */
describe("Conversation (Plain Requests)", () => {
    beforeEach(async () => {
        await Conversation.deleteMany({});
    });

    afterAll(async () => {
        await Conversation.deleteMany({});
    });

    // List route
    it("List conversations (plain request)", async () => {
        const response = await request(app)
            .get("/conversation");

        expect(response.status).toBe(200);
    });

    // Create route
    it("Create a conversation (plain request)", async () => {
        const response = await request(app)
            .post("/conversation")
            .send({ retrieve_chat: [], deliver_chat: [] });

        expect(response.status).toBe(201);
    });

    // Read route
    it("Reads a conversation (plain request)", async () => {
        const conversations = await request(app).get("/conversation");
        const conversation = conversations[0];

        const response = await request(app)
            .get($`/conversation/${conversation._id}`);

        expect(response.status).toBe(200);
    });

    // Update route
    it("Updates a conversation (plain request)", async () => {
        const conversations = await request(app).get("/conversation");
        const conversation = conversations[0];

        const response = await request(app)
            .put($`/conversation/${conversation._id}`)
            .send({
                retrieve_chat: [
                    { sender: 0, message: "Hello, I am Provider!"},
                    { sender: 1, message: "Hello, I am Deliveryman!"}
                ],
                deliver_chat: [
                    { sender: 0, message: "Hello, I am Deliveryman!"},
                    { sender: 1, message: "Hello, I am Client!"}
                ]
            });

        expect(response.status).toBe(200);
    });

    // Delete route
    it("Deletes a conversation (plain request)", async () => {
        const conversations = await request(app).get("/conversation");
        const conversation = conversations[0];

        const response = await request(app)
            .delete($`/conversation/${conversation._id}`);
            
        expect(response.status).toBe(204);
    });
});

// to-do: Make the same request, but double checking the response

afterAll(async () => {
    mongoose.connection.close();
});
