const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../src/app");
const User = require("../../src/models/User");

describe("UserPost", () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
    });

    it("should not create a user without login", async () => {
        const response = await request(app)
            .post("/users")
            .send({ password: "123456" });

        expect(response.status).toBe(401);
    });

    it("should not create a user without password", async () => {
        const response = await request(app)
            .post("/users")
            .send({ login: "fulano@example.com" });

        expect(response.status).toBe(401);
    });

    it("should not create a user without login and password", async () => {
        const response = await request(app).post("/users").send({});

        expect(response.status).toBe(401);
    });

    it("should not create a user with login invalid", async () => {
        const response = await request(app)
            .post("/users")
            .send({ login: "", password: "123456" });

        expect(response.status).toBe(401);
    });

    it("should not create a user with password invalid", async () => {
        const response = await request(app)
            .post("/users")
            .send({ login: "fulano@example.com", password: "" });

        expect(response.status).toBe(401);
    });

    it("should not create a user with login and password invalid", async () => {
        const response = await request(app)
            .post("/users")
            .send({ login: "", password: "" });

        expect(response.status).toBe(401);
    });

    it("should not create a user that already exists", async () => {
        await User.create({ login: "fulano@example.com", password: "123456" });

        const response = await request(app)
            .post("/users")
            .send({ login: "fulano@example.com", password: "123456" });

        expect(response.status).toBe(403);
    });

    it("should create a user", async () => {
        const response = await request(app)
            .post("/users")
            .send({ login: "fulano@example.com", password: "123456" });

        expect(response.status).toBe(201);
    });
});

describe("UserGet", () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
    });

    it("should not show a user that not exists", async () => {
        const id = "6fd98634aefe50343c0a63bf";

        const response = await request(app).get(`/users/${id}`);

        expect(response.status).toBe(404);
    });

    it("should show a specific user", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const response = await request(app).get(`/users/${user._id}`);

        expect(response.status).toBe(200);
    });

    it("should show all users", async () => {
        await User.create({ login: "fulano@example.com", password: "123456" });
        await User.create({ login: "cicrano@example.com", password: "123456" });

        const response = await request(app).get("/users");

        expect(response.status).toBe(200);
    });
});

describe("UserUpdate", () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
    });

    it("should not update a user without login", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const response = await request(app)
            .put(`/users/${user._id}`)
            .send({ password: "654321" });

        expect(response.status).toBe(401);
    });

    it("should not update a user without password", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const response = await request(app)
            .put(`/users/${user._id}`)
            .send({ login: "cicrano@example.com" });

        expect(response.status).toBe(401);
    });

    it("should not update a user that not exists", async () => {
        const response = await request(app)
            .put(`/user/6fd94d2bfe3977307c7b5aef`)
            .send({ login: "cicrano@example.com", password: "654321 " });

        expect(response.status).toBe(404);
    });

    it("should update a user", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const response = await request(app)
            .put(`/users/${user._id}`)
            .send({ login: "cicrano@example.com", password: "654321" });

        expect(response.status).toBe(200);
    });
});

describe("UserDelete", () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
    });

    it("should not delete a user that not exists", async () => {
        const response = await request(app).delete(
            "/users/5fd94d2bfe3977307c7b5aef"
        );

        expect(response.status).toBe(404);
    });

    it("should delete a user", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const response = await request(app).delete(`/users/${user._id}`);

        expect(response.status).toBe(204);
    });
});

afterAll(async () => {
    mongoose.connection.close();
});
