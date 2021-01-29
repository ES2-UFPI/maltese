const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../src/app");
const User = require("../../src/models/User");
const Deliveryman = require("../../src/models/Deliveryman");

describe("DeliverymanPost", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Deliveryman.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Deliveryman.deleteMany({});
    });

    it("should not create a deliveryman without name", async () => {
        const response = await request(app)
            .post("/deliverymen")
            .send({ user: "5fd94d2bfe3977307c7b5aef123456" });

        expect(response.status).toBe(401);
    });

    it("should not create a deliveryman without user", async () => {
        const response = await request(app)
            .post("/deliverymen")
            .send({ name: "Zé" });

        expect(response.status).toBe(401);
    });

    it("should not create a deliveryman without name and user", async () => {
        const response = await request(app).post("/deliverymen").send({});

        expect(response.status).toBe(401);
    });

    it("should not create a deliveryman with name invalid", async () => {
        const response = await request(app)
            .post("/deliverymen")
            .send({ name: "", user: "5fd94d2bfe3977307c7b5aef123456" });

        expect(response.status).toBe(401);
    });

    it("should not create a deliveryman with user invalid", async () => {
        const response = await request(app)
            .post("/deliverymen")
            .send({ name: "Zé", user: "" });

        expect(response.status).toBe(401);
    });

    it("should not create a deliveryman with name and user invalid", async () => {
        const response = await request(app)
            .post("/deliverymen")
            .send({ name: "", user: "" });

        expect(response.status).toBe(401);
    });

    it("should not create a deliveryman that already exists", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        await Deliveryman.create({ name: "Fulano", user: user._id });

        const response = await request(app)
            .post("/deliverymen")
            .send({ name: "Cicrano", user: user._id });

        expect(response.status).toBe(403);
    });

    it("should create a deliveryman", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const response = await request(app)
            .post("/deliverymen")
            .send({ name: "Fulano", user: user._id });

        expect(response.status).toBe(201);
    }); 
});

describe("DeliverymanGet", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Deliveryman.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Deliveryman.deleteMany({});
    });

    it("should not show a deliveryman that not exists", async () => {
        const response = await request(app).get(`/deliverymen/1fd98634aefe50343c0a63bf`);

        expect(response.status).toBe(404);
    });

    it("should show a specific deliveryman", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const deliveryman = await Deliveryman.create({
            name: "Fulano",
            user: user._id,
        });

        const response = await request(app).get(
            `/deliverymen/${deliveryman._id}`
        );

        expect(response.status).toBe(200);
    });

    it("should show all deliverymans", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });
        const user2 = await User.create({
            login: "cicrano@example.com",
            password: "123456",
        });

        await Deliveryman.create({ name: "Fulano", user: user._id });
        await Deliveryman.create({ name: "Cicrano", user: user2._id });

        const response = await request(app).get("/deliverymen");

        expect(response.status).toBe(200);
    }); 
});

describe("DeliverymanUpdate", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Deliveryman.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Deliveryman.deleteMany({});
    });

    it("should not update a deliveryman without name", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const deliveryman = await Deliveryman.create({
            name: "Fulano",
            user: user._id,
        });

        const response = await request(app)
            .put(`/deliverymen/${deliveryman._id}`)
            .send({});

        expect(response.status).toBe(401);
    });

    it("should not update a deliveryman that not exists", async () => {
        const response = await request(app)
            .put(`/deliverymen/6fd94d2bfe3977307c7b5aef`)
            .send({ name: "Cicrano" });

        expect(response.status).toBe(404);
    }); 

    it("should update a deliveryman", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const deliveryman = await Deliveryman.create({
            name: "Fulano",
            user: user._id,
        });

        const response = await request(app)
            .put(`/deliverymen/${deliveryman._id}`)
            .send({ name: "FULANO" });

        expect(response.status).toBe(200);
    });
});

describe("DeliverymanDelete", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Deliveryman.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Deliveryman.deleteMany({});
    });

    it("should not delete a deliveryman that not exists", async () => {
        const response = await request(app).delete(
            "/deliverymen/6fd94d2bfe3977307c7b5aef"
        );

        expect(response.status).toBe(404);
    });

    it("should delete a deliveryman", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const deliveryman = await Deliveryman.create({
            name: "Fulano",
            user: user._id,
        });

        const response = await request(app).delete(
            `/deliverymen/${deliveryman._id}`
        );
        expect(response.status).toBe(204);
    });
});

afterAll(async () => {
    mongoose.connection.close();
});
