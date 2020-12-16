const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../src/app");
const User = require("../../src/models/User");
const Client = require("../../src/models/Client");

describe("ClientPost", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
    });

    it("should not create a client without name", async () => {
        const response = await request(app)
            .post("/clients")
            .send({ user: "5fd94d2bfe3977307c7b5aef123456" });

        expect(response.status).toBe(401);
    });

    it("should not create a client without user", async () => {
        const response = await request(app)
            .post("/clients")
            .send({ name: "Zé" });

        expect(response.status).toBe(401);
    });

    it("should not create a client without name and user", async () => {
        const response = await request(app).post("/clients").send({});

        expect(response.status).toBe(401);
    });

    it("should not create a client with name invalid", async () => {
        const response = await request(app)
            .post("/clients")
            .send({ name: "", user: "5fd94d2bfe3977307c7b5aef123456" });

        expect(response.status).toBe(401);
    });

    it("should not create a client with user invalid", async () => {
        const response = await request(app)
            .post("/clients")
            .send({ name: "Zé", user: "" });

        expect(response.status).toBe(401);
    });

    it("should not create a client with name and user invalid", async () => {
        const response = await request(app)
            .post("/clients")
            .send({ name: "", user: "" });

        expect(response.status).toBe(401);
    });

    it("should not create a client that already exists", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        await Client.create({ name: "Fulano", user: user._id });

        const response = await request(app)
            .post("/clients")
            .send({ name: "Cicrano", user: user._id });

        expect(response.status).toBe(403);
    });

    it("should create a client", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const response = await request(app)
            .post("/clients")
            .send({ name: "Fulano", user: user._id });

        expect(response.status).toBe(201);
    });
});

describe("ClientGet", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
    });

    it("should not show a client that not exists", async () => {
        const id = "6fd98634aefe50343c0a63bf";

        const response = await request(app).get(`/clients/${id}`);

        expect(response.status).toBe(404);
    });

    it("should show a specific client", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const response = await request(app).get(`/clients/${client._id}`);

        expect(response.status).toBe(200);
    });

    it("should show all clients", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });
        const user2 = await User.create({
            login: "cicrano@example.com",
            password: "123456",
        });

        await Client.create({ name: "Fulano", user: user._id });
        await Client.create({ name: "Cicrano", user: user2._id });

        const response = await request(app).get("/clients");

        expect(response.status).toBe(200);
    });
});

describe("ClientUpdate", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
    });

    it("should not update a client without name", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const response = await request(app)
            .put(`/clients/${client._id}`)
            .send({});

        expect(response.status).toBe(401);
    });

    it("should not update a client that not exists", async () => {
        const response = await request(app)
            .put(`/clients/6fd94d2bfe3977307c7b5aef`)
            .send({ name: "Cicrano" });

        expect(response.status).toBe(404);
    });

    it("should update a client", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const response = await request(app)
            .put(`/clients/${client._id}`)
            .send({ name: "FULANO" });

        expect(response.status).toBe(200);
    });
});

describe("ClientDelete", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
    });

    it("should not delete a client that not exists", async () => {
        const response = await request(app).delete(
            "/clients/6fd94d2bfe3977307c7b5aef"
        );

        expect(response.status).toBe(404);
    });

    it("should delete a client", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const response = await request(app).delete(`/clients/${client._id}`);

        expect(response.status).toBe(204);
    });
});

afterAll(async () => {
    mongoose.connection.close();
});
