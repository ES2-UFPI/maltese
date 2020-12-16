const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../src/app");
const User = require("../../src/models/User");
const Provider = require("../../src/models/Provider");

describe("ProviderPost", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Provider.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Provider.deleteMany({});
    });

    it("should not create a provider without name", async () => {
        const response = await request(app)
            .post("/providers")
            .send({ user: "6fd94d2bfe3977307c7b5aef123456" });

        expect(response.status).toBe(401);
    });

    it("should not create a provider without user", async () => {
        const response = await request(app)
            .post("/providers")
            .send({ name: "CasaDoMalte" });

        expect(response.status).toBe(401);
    });

    it("should not create a provider without name and user", async () => {
        const response = await request(app).post("/providers").send({});

        expect(response.status).toBe(401);
    });

    it("should not create a provider with name invalid", async () => {
        const response = await request(app)
            .post("/providers")
            .send({ name: "", user: "6fd94d2bfe3977307c7b5aef123456" });

        expect(response.status).toBe(401);
    });

    it("should not create a provider with user invalid", async () => {
        const response = await request(app)
            .post("/providers")
            .send({ name: "CasaDoMalte", user: "" });

        expect(response.status).toBe(401);
    });

    it("should not create a provider with name and user invalid", async () => {
        const response = await request(app)
            .post("/providers")
            .send({ name: "", user: "" });

        expect(response.status).toBe(401);
    });

    it("should not create a provider that already exists", async () => {
        const user = await User.create({
            login: "loja@example.com",
            password: "123456",
        });

        await Provider.create({ name: "CasaDoMalte", user: user._id });

        const response = await request(app)
            .post("/providers")
            .send({ name: "The Bar", user: user._id });

        expect(response.status).toBe(403);
    });

    it("should create a provider", async () => {
        const user = await User.create({
            login: "loja@example.com",
            password: "123456",
        });

        const response = await request(app)
            .post("/providers")
            .send({ name: "CasaDoMalte", user: user._id });

        expect(response.status).toBe(201);
    });
});

describe("ProviderGet", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Provider.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Provider.deleteMany({});
    });

    it("should not show a provider that not exists", async () => {
        const id = "6fd98634aefe50343c0a63bf";

        const response = await request(app).get(`/providers/${id}`);

        expect(response.status).toBe(404);
    });

    it("should show a specific provider", async () => {
        const user = await User.create({
            login: "loja@example.com",
            password: "123456",
        });

        const provider = await Provider.create({
            name: "CasaDoMalte",
            user: user._id,
        });

        const response = await request(app).get(`/providers/${provider._id}`);

        expect(response.status).toBe(200);
    });

    it("should show all providers", async () => {
        const user = await User.create({
            login: "loja@example.com",
            password: "123456",
        });
        const user2 = await User.create({
            login: "loja2@example.com",
            password: "123456",
        });

        await Provider.create({ name: "CasaDoMalte", user: user._id });
        await Provider.create({ name: "The Bar", user: user2._id });

        const response = await request(app).get("/providers");

        expect(response.status).toBe(200);
    });
});

describe("ProviderUpdate", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Provider.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Provider.deleteMany({});
    });

    it("should not update a provider without name", async () => {
        const user = await User.create({
            login: "loja@example.com",
            password: "123456",
        });

        const provider = await Provider.create({
            name: "CasaDoMalte",
            user: user._id,
        });

        const response = await request(app)
            .put(`/providers/${provider._id}`)
            .send({ products: [] });

        expect(response.status).toBe(401);
    });

    it("should not update a provider that not exists", async () => {
        const response = await request(app)
            .put(`/providers/6fd94d2bfe3977307c7b5aef`)
            .send({ name: "The Bar" });

        expect(response.status).toBe(404);
    });

    it("should update a provider", async () => {
        const user = await User.create({
            login: "loja@example.com",
            password: "123456",
        });

        const provider = await Provider.create({
            name: "CasaDoMalte",
            user: user._id,
        });

        const response = await request(app)
            .put(`/providers/${provider._id}`)
            .send({ name: "The Bar" });

        expect(response.status).toBe(200);
    });
});

describe("ProviderDelete", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Provider.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Provider.deleteMany({});
    });

    it("should not delete a provider that not exists", async () => {
        const response = await request(app).delete(
            "/providers/6fd94d2bfe3977307c7b5aef"
        );

        expect(response.status).toBe(404);
    });

    it("should delete a provider", async () => {
        const user = await User.create({
            login: "loja@example.com",
            password: "123456",
        });

        const provider = await Provider.create({
            name: "CasaDoMalte",
            user: user._id,
        });

        const response = await request(app).delete(
            `/providers/${provider._id}`
        );

        expect(response.status).toBe(204);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
