const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../src/app");
const User = require("../../src/models/User");
const Client = require("../../src/models/Client");
const Provider = require("../../src/models/Provider");
const Deliveryman = require("../../src/models/Deliveryman");
const Product = require("../../src/models/Product");
const Order = require("../../src/models/Order");
const Delivery = require("../../src/models/Delivery");

describe("DeliveryPost", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
        await Provider.deleteMany({});
        await Deliveryman.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Delivery.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
        await Provider.deleteMany({});
        await Deliveryman.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Delivery.deleteMany({});
    });

    it("should create a delivery", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const deliveryman = await Deliveryman.create({
            name: "FulanoEntregas",
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

        const response = await request(app).post("/deliveries").send({
            client: client._id,
            deliveryman: deliveryman._id,
            order: order._id,
        });

        expect(response.status).toBe(201);
    });

    it("should not create a delivery without client", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const deliveryman = await Deliveryman.create({
            name: "FulanoEntregas",
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

        const response = await request(app).post("/deliveries").send({
            deliveryman: deliveryman._id,
            order: order._id,
        });

        expect(response.status).toBe(401);
    });

    it("should not create a delivery without deliveryman", async () => {
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

        const response = await request(app).post("/deliveries").send({
            client: client._id,
            order: order._id,
        });

        expect(response.status).toBe(401);
    });

    it("should not create a delivery without order", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const deliveryman = await Deliveryman.create({
            name: "FulanoEntregas",
            user: user._id,
        });

        const response = await request(app).post("/deliveries").send({
            client: client._id,
            deliveryman: deliveryman._id,
        });

        expect(response.status).toBe(401);
    });

    it("should not create a delivery with client invalid", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const deliveryman = await Deliveryman.create({
            name: "FulanoEntregas",
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

        const response = await request(app).post("/deliveries").send({
            client: "",
            deliveryman: deliveryman._id,
            order: order._id,
        });

        expect(response.status).toBe(401);
    });

    it("should not create a delivery with deliveryman invalid", async () => {
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

        const response = await request(app).post("/deliveries").send({
            client: client._id,
            deliveryman: "",
            order: order._id,
        });

        expect(response.status).toBe(401);
    });

    it("should not create a delivery with order invalid", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const deliveryman = await Deliveryman.create({
            name: "FulanoEntregas",
            user: user._id,
        });

        const response = await request(app).post("/deliveries").send({
            client: client._id,
            deliveryman: deliveryman._id,
            order: "",
        });

        expect(response.status).toBe(401);
    });

    it("should not create a delivery from order that not exits", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const deliveryman = await Deliveryman.create({
            name: "FulanoEntregas",
            user: user._id,
        });

        const response = await request(app).post("/deliveries").send({
            client: client._id,
            deliveryman: deliveryman._id,
            order: "4fd98634aefe50343c0a63bf",
        });

        expect(response.status).toBe(404);
    });

    it("should not create a delivery that already exits", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const deliveryman = await Deliveryman.create({
            name: "FulanoEntregas",
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

        await Delivery.create({
            client: client._id,
            deliveryman: deliveryman._id,
            order: order._id,
        });

        const response = await request(app).post("/deliveries").send({
            client: client._id,
            deliveryman: deliveryman._id,
            order: order._id,
        });

        expect(response.status).toBe(403);
    });
});
 

describe("DeliveryGet", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
        await Provider.deleteMany({});
        await Deliveryman.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Delivery.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
        await Provider.deleteMany({});
        await Deliveryman.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Delivery.deleteMany({});
    });

    it("should show all deliveries", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const deliveryman = await Deliveryman.create({
            name: "FulanoEntregas",
            user: user._id,
        });

        const product = await Product.create({
            name: "Cerveja",
            price: 10,
            description: "foo",
        });

        const order1 = await Order.create({
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
        const order2 = await Order.create({
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

        await Delivery.create({
            client: client._id,
            deliveryman: deliveryman._id,
            order: order1._id,
        });
        await Delivery.create({
            client: client._id,
            deliveryman: deliveryman._id,
            order: order2._id,
        });

        const response = await request(app).get("/deliveries");

        expect(response.status).toBe(200);
    });

    it("should show a specific delivery", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const deliveryman = await Deliveryman.create({
            name: "FulanoEntregas",
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

        await Delivery.create({
            client: client._id,
            deliveryman: deliveryman._id,
            order: order._id,
        });

        const response = await request(app).get(`/deliveries/${order._id}`);

        expect(response.status).toBe(200);
    });

    it("should not show a delivery that not exists", async () => {
        const order = "4fd98634aefe50343c0a63bf";

        const response = await request(app).get(`/deliveries/${order}`);

        expect(response.status).toBe(404);
    });
});


describe("DeliveryPut", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
        await Provider.deleteMany({});
        await Deliveryman.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Delivery.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
        await Provider.deleteMany({});
        await Deliveryman.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Delivery.deleteMany({});
    });

    it("should update a delivery", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const deliveryman = await Deliveryman.create({
            name: "FulanoEntregas",
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
            status: 3,
        });

        const delivery = await Delivery.create({
            client: client._id,
            deliveryman: deliveryman._id,
            order: order._id,
        });

        const response = await request(app)
            .put(`/deliveries/${delivery._id}`)
            .send({
                client: client._id,
                order: order._id,
                status: 1,
            });

        expect(response.status).toBe(200);
    });

    it("should not update a delivery without client", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const deliveryman = await Deliveryman.create({
            name: "FulanoEntregas",
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

        const delivery = await Delivery.create({
            client: client._id,
            deliveryman: deliveryman._id,
            order: order._id,
        });

        const response = await request(app)
            .put(`/deliveries/${delivery._id}`)
            .send({
                order: order._id,
                status: 1
            });

        expect(response.status).toBe(401);
    });

    it("should not update a delivery without order", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const deliveryman = await Deliveryman.create({
            name: "FulanoEntregas",
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

        const delivery = await Delivery.create({
            client: client._id,
            deliveryman: deliveryman._id,
            order: order._id,
        });

        const response = await request(app)
            .put(`/deliveries/${delivery._id}`)
            .send({
                client: client._id,
                status: 1
            });

        expect(response.status).toBe(401);
    });

    it("should not update a delivery without status", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const deliveryman = await Deliveryman.create({
            name: "FulanoEntregas",
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

        const delivery = await Delivery.create({
            client: client._id,
            deliveryman: deliveryman._id,
            order: order._id,
        });

        const response = await request(app)
            .put(`/deliveries/${delivery._id}`)
            .send({
                client: client._id,
                order: order._id,
            });

        expect(response.status).toBe(401);
    });

    it("should not update a delivery with client invalid", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const deliveryman = await Deliveryman.create({
            name: "FulanoEntregas",
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

        const delivery = await Delivery.create({
            client: client._id,
            deliveryman: deliveryman._id,
            order: order._id,
        });

        const response = await request(app)
            .put(`/deliveries/${delivery._id}`)
            .send({
                client: "",
                order: order._id,
                status: 1
            });

        expect(response.status).toBe(401);
    });

    it("should not update a delivery with order invalid", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const deliveryman = await Deliveryman.create({
            name: "FulanoEntregas",
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

        const delivery = await Delivery.create({
            client: client._id,
            deliveryman: deliveryman._id,
            order: order._id,
        });

        const response = await request(app)
            .put(`/deliveries/${delivery._id}`)
            .send({
                client: client._id,
                order: "",
                status: 1
            });

        expect(response.status).toBe(401);
    });

    it("should not update a delivery with status invalid", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const deliveryman = await Deliveryman.create({
            name: "FulanoEntregas",
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

        const delivery = await Delivery.create({
            client: client._id,
            deliveryman: deliveryman._id,
            order: order._id,
        });

        const response = await request(app)
            .put(`/deliveries/${delivery._id}`)
            .send({
                client: client._id,
                order: order._id,
                status: ""
            });

        expect(response.status).toBe(401);
    });

    it("should not update a delivery that not exists", async () => {
        const response = await request(app)
            .put("/deliveries/5fd94d2bfe3977307c7b5aef")
            .send({
                client: "4fd94d2bfe3977307c7b5aef",
                order: "2fd94d2bfe3977307c7b5aef",
                status: 2,
            });

        expect(response.status).toBe(404);
    });
});


describe("DeliveryDelete", () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
        await Provider.deleteMany({});
        await Deliveryman.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Delivery.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Client.deleteMany({});
        await Provider.deleteMany({});
        await Deliveryman.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        await Delivery.deleteMany({});
    });

    it("should delete a delivery", async () => {
        const user = await User.create({
            login: "fulano@example.com",
            password: "123456",
        });

        const client = await Client.create({ name: "Fulano", user: user._id });

        const provider = await Provider.create({
            name: "FulanoBar",
            user: user._id,
        });

        const deliveryman = await Deliveryman.create({
            name: "FulanoEntregas",
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

        const delivery = await Delivery.create({
            client: client._id,
            deliveryman: deliveryman._id,
            order: order._id,
        });

        const response = await request(app).delete(`/deliveries/${delivery._id}`);

        expect(response.status).toBe(204);
    });

    it("should not delete a delivery that not exists", async () => {
        const response = await request(app).delete(
            "/deliveries/4fd94d2bfe3977307c7b5aef"
        );

        expect(response.status).toBe(404);
    });
});

afterAll(async () => {
    mongoose.connection.close();
});
