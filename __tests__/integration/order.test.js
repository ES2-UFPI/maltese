const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../src/app");
const User = require("../../src/models/User");
const Client = require("../../src/models/Client");
const Provider = require("../../src/models/Provider");
const Product = require("../../src/models/Product");
const Order = require("../../src/models/Order");

describe("OrderPost", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
        await Provider.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
        await Provider.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
    });

    it("should create a order", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const product = await Product.create({
            name: "Cerveja",
            price: 10,
            description: "foo",
        });

        const response = await request(app)
            .post("/orders")
            .send({
                client: client._id,
                provider: provider._id,
                items: [
                    {
                        product: product._id,
                        quantity: 30,
                    },
                ],
                address: "-22.951683817477424, -43.2104550160534",
            });

        expect(response.status).toBe(201);
    });

    it("should not create a order without client", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const product = await Product.create({
            name: "Cerveja",
            price: 10,
            description: "foo",
        });

        const response = await request(app)
            .post("/orders")
            .send({
                provider: provider._id,
                items: [
                    {
                        product: product._id,
                        quantity: 30,
                    },
                ],
                address: "-22.951683817477424, -43.2104550160534",
            });

        expect(response.status).toBe(401);
    });

    it("should not create a order without provider", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const product = await Product.create({
            name: "Cerveja",
            price: 10,
            description: "foo",
        });

        const response = await request(app)
            .post("/orders")
            .send({
                client: client._id,
                items: [
                    {
                        product: product._id,
                        quantity: 30,
                    },
                ],
                address: "-22.951683817477424, -43.2104550160534",
            });

        expect(response.status).toBe(401);
    });

    it("should not create a order without items", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });
        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const response = await request(app).post("/orders").send({
            client: client._id,
            provider: provider._id,
            address: "-22.951683817477424, -43.2104550160534",
        });

        expect(response.status).toBe(401);
    });

    it("should not create a order with client invalid", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const product = await Product.create({
            name: "Cerveja",
            price: 10,
            description: "foo",
        });

        const response = await request(app)
            .post("/orders")
            .send({
                client: "",
                provider: provider._id,
                items: [
                    {
                        product: product._id,
                        quantity: 30,
                    },
                ],
                address: "-22.951683817477424, -43.2104550160534",
            });

        expect(response.status).toBe(401);
    });

    it("should not create a order with provider invalid", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const product = await Product.create({
            name: "Cerveja",
            price: 10,
            description: "foo",
        });

        const response = await request(app)
            .post("/orders")
            .send({
                client: client._id,
                provider: "",
                items: [
                    {
                        product: product._id,
                        quantity: 30,
                    },
                ],
                address: "-22.951683817477424, -43.2104550160534",
            });

        expect(response.status).toBe(401);
    });

    it("should not create a order with items invalid", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const response = await request(app).post("/orders").send({
            client: client._id,
            provider: provider._id,
            items: "",
            address: "-22.951683817477424, -43.2104550160534",
        });

        expect(response.status).toBe(401);
    });

    it("should not create a order that already exits", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const product = await Product.create({
            name: "Cerveja",
            price: 10,
            description: "foo",
        });

        await Order.create({
            client: client._id,
            provider: provider._id,
            items: [
                {
                    product: product._id,
                    quantity: 30,
                },
            ],
            status: 0,
            address: "-22.951683817477424, -43.2104550160534",
        });

        const response = await request(app)
            .post("/orders")
            .send({
                client: client._id,
                provider: provider._id,
                items: [
                    {
                        product: product._id,
                        quantity: 30,
                    },
                ],
                status: 0,
                address: "-22.951683817477424, -43.2104550160534",
            });

        expect(response.status).toBe(403);
    });
});


describe("OrderGet", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
        await Provider.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
        await Provider.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
    });

    it("should show all orders", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const product = await Product.create({
            name: "Cerveja",
            price: 10,
            description: "foo",
        });

        await Order.create({
            client: client._id,
            provider: provider._id,
            items: [
                {
                    product: product._id,
                    quantity: 30,
                },
            ],
            address: "-22.951683817477424, -43.2104550160534",
            status: 0,
        });
        await Order.create({
            client: client._id,
            provider: provider._id,
            items: [
                {
                    product: product._id,
                    quantity: 30,
                },
            ],
            address: "-22.951683817477424, -43.2104550160534",
            status: 1,
        });

        const response = await request(app).get("/orders");

        expect(response.status).toBe(200);
    });

    it("should show a specific order", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const product = await Product.create({
            name: "Cerveja",
            price: 10,
            description: "foo",
        });

        const order = await Order.create({
            client: client._id,
            provider: provider._id,
            items: [
                {
                    product: product._id,
                    quantity: 30,
                },
            ],
            address: "-22.951683817477424, -43.2104550160534",
            status: 0,
        });

        const response = await request(app).get(`/orders/${order._id}`);

        expect(response.status).toBe(200);
    });

    it("should not show a order that not exists", async () => {
        const id = "5fd98634aefe50343c0a63bf";

        const response = await request(app).get(`/orders/${id}`);

        expect(response.status).toBe(404);
    });
});


describe("OrderPut", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
        await Provider.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
        await Provider.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
    });

    it("should update a order", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const product = await Product.create({
            name: "Cerveja",
            price: 10,
            description: "foo",
        });

        const order = await Order.create({
            client: client._id,
            provider: provider._id,
            items: [
                {
                    product: product._id,
                    quantity: 30,
                },
            ],
            address: "-22.951683817477424, -43.2104550160534",
            status: 0,
        });

        const response = await request(app).put(`/orders/${order._id}`).send({
            client: client._id,
            provider: provider._id,
            items: [
                {
                    product: product._id,
                    quantity: 100,
                },
            ],
            address: "-25.951683817477424, -93.2104550160534",
            status: 2,
        });

        expect(response.status).toBe(200);
    });

    it("should not update a order without client", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const product = await Product.create({
            name: "Cerveja",
            price: 10,
            description: "foo",
        });

        const order = await Order.create({
            client: client._id,
            provider: provider._id,
            items: [
                {
                    product: product._id,
                    quantity: 30,
                },
            ],
            address: "-22.951683817477424, -43.2104550160534",
            status: 0,
        });

        const response = await request(app).put(`/orders/${order._id}`).send({
            provider: provider._id,
            items: [
                {
                    product: product._id,
                    quantity: 100,
                },
            ],
            address: "-25.951683817477424, -93.2104550160534",
            status: 2,
        });

        expect(response.status).toBe(401);
    });

    it("should not update a order without provider", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const product = await Product.create({
            name: "Cerveja",
            price: 10,
            description: "foo",
        });

        const order = await Order.create({
            client: client._id,
            provider: provider._id,
            items: [
                {
                    product: product._id,
                    quantity: 30,
                },
            ],
            address: "-22.951683817477424, -43.2104550160534",
            status: 0,
        });

        const response = await request(app).put(`/orders/${order._id}`).send({
            client: client._id,
            items: [
                {
                    product: product._id,
                    quantity: 100,
                },
            ],
            address: "-25.951683817477424, -93.2104550160534",
            status: 2,
        });

        expect(response.status).toBe(401);
    });

    it("should not update a order without items", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const product = await Product.create({
            name: "Cerveja",
            price: 10,
            description: "foo",
        });

        const order = await Order.create({
            client: client._id,
            provider: provider._id,
            items: [
                {
                    product: product._id,
                    quantity: 30,
                },
            ],
            address: "-22.951683817477424, -43.2104550160534",
            status: 0,
        });

        const response = await request(app).put(`/orders/${order._id}`).send({
            client: client._id,
            provider: provider._id,
            address: "-25.951683817477424, -93.2104550160534",
            status: 2,
        });

        expect(response.status).toBe(401);
    });

    it("should not update a order with client invalid", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const product = await Product.create({
            name: "Cerveja",
            price: 10,
            description: "foo",
        });

        const order = await Order.create({
            client: client._id,
            provider: provider._id,
            items: [
                {
                    product: product._id,
                    quantity: 30,
                },
            ],
            address: "-22.951683817477424, -43.2104550160534",
            status: 0,
        });

        const response = await request(app).put(`/orders/${order._id}`).send({
            client: "",
            provider: provider._id,
            items: [
                {
                    product: product._id,
                    quantity: 100,
                },
            ],
            address: "-25.951683817477424, -93.2104550160534",
            status: 2,
        });

        expect(response.status).toBe(401);
    });

    it("should not update a order with provider invalid", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const product = await Product.create({
            name: "Cerveja",
            price: 10,
            description: "foo",
        });

        const order = await Order.create({
            client: client._id,
            provider: provider._id,
            items: [
                {
                    product: product._id,
                    quantity: 30,
                },
            ],
            address: "-22.951683817477424, -43.2104550160534",
            status: 0,
        });

        const response = await request(app).put(`/orders/${order._id}`).send({
            client: client._id,
            provider: "",
            items: [
                {
                    product: product._id,
                    quantity: 100,
                },
            ],
            address: "-25.951683817477424, -93.2104550160534",
            status: 2,
        });

        expect(response.status).toBe(401);
    });

    it("should not update a order with items invalid", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const product = await Product.create({
            name: "Cerveja",
            price: 10,
            description: "foo",
        });

        const order = await Order.create({
            client: client._id,
            provider: provider._id,
            items: [
                {
                    product: product._id,
                    quantity: 30,
                },
            ],
            address: "-22.951683817477424, -43.2104550160534",
            status: 0,
        });

        const response = await request(app).put(`/orders/${order._id}`).send({
            client: client._id,
            provider: provider._id,
            items: "",
            address: "-25.951683817477424, -93.2104550160534",
            status: 2,
        });

        expect(response.status).toBe(401);
    });

    it("should not update a order that not exists", async () => {
        const response = await request(app)
            .put("/orders/5fd94d2bfe3977307c7b5aef")
            .send({
                client: "4fd94d2bfe3977307c7b5aef",
                provider: "3fd94d2bfe3977307c7b5aef",
                items: [
                    {
                        product: "2fd94d2bfe3977307c7b5aef",
                        quantity: 100,
                    },
                ],
                address: "-25.951683817477424, -93.2104550160534",
                status: 2,
            });

        expect(response.status).toBe(404);
    });
});


describe("OrderDelete", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
        await Provider.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
        await Provider.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
    });

    it("should delete a order", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const product = await Product.create({
            name: "Cerveja",
            price: 10,
            description: "foo",
        });

        const order = await Order.create({
            client: client._id,
            provider: provider._id,
            items: [
                {
                    product: product._id,
                    quantity: 30,
                },
            ],
            address: "-22.951683817477424, -43.2104550160534",
            status: 0,
        });

        const response = await request(app).delete(`/orders/${order._id}`);

        expect(response.status).toBe(204);
    });

    it("should not delete a order that not exists", async () => {
        const response = await request(app).delete(
            "/orders/5fd94d2bfe3977307c7b5aef"
        );

        expect(response.status).toBe(404);
    });
});

afterAll(async () => {
    mongoose.connection.close();
});
