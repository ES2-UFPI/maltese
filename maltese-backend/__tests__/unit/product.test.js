const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../src/app");
const Product = require("../../src/models/Product");

describe("ProductPost", () => {
    beforeEach(async () => {
        await Product.deleteMany({});
    });

    afterAll(async () => {
        await Product.deleteMany({});
    });

    it("should not create a product without name", async () => {
        const response = await request(app)
            .post("/products")
            .send({ price: 50, description: "foo", filename: "default.jpg" });

        expect(response.status).toBe(401);
    });

    it("should not create a product without price", async () => {
        const response = await request(app)
            .post("/products")
            .send({ name: "Cerveja", description: "foo", filename: "default.jpg" });

        expect(response.status).toBe(401);
    });

    it("should not create a product without name and price", async () => {
        const response = await request(app).post("/products").send({});

        expect(response.status).toBe(401);
    });

    it("should not create a product with name invalid", async () => {
        const response = await request(app)
            .post("/products")
            .send({ name: "", price: 50, description: "foo", filename: "default.jpg" });

        expect(response.status).toBe(401);
    });

    it("should not create a product with price invalid", async () => {
        const response = await request(app)
            .post("/products")
            .send({ name: "Cerveja", description: "foo", filename: "default.jpg" });

        expect(response.status).toBe(401);
    });

    it("should not create a product with name and price invalid", async () => {
        const response = await request(app)
            .post("/products")
            .send({ name: "", price: "", description: "foo", filename: "default.jpg" });

        expect(response.status).toBe(401);
    });

    it("should not create a product that already exists", async () => {
        await Product.create({ name: "Cerveja", price: 10, description: "foo", filename: "default.jpg" });

        const response = await request(app)
            .post("/products")
            .send({ name: "Cerveja", price: 5, description: "foo", filename: "default.jpg" });

        expect(response.status).toBe(403);
    });

    it("should create a product", async () => {
        const response = await request(app)
            .post("/products")
            .send({ name: "Cerveja", price: 10, description: "foo", filename: "default.jpg" });

        expect(response.status).toBe(201);
    });
});

describe("ProductGet", () => {
    beforeEach(async () => {
        await Product.deleteMany({});
    });

    afterAll(async () => {
        await Product.deleteMany({});
    });

    it("should not show a product that not exists", async () => {
        const id = "6fd98634aefe50343c0a63bf";

        const response = await request(app).get(`/products/${id}`);

        expect(response.status).toBe(404);
    });

    it("should show a specific product", async () => {
        const product = await Product.create({ name: "Cerveja", price: 10, description: "foo", filename: "default.jpg" });

        const response = await request(app).get(`/products/${product._id}`);

        expect(response.status).toBe(200);
    });

    it("should show all products", async () => {
        await Product.create({ name: "Cerveja", price: 10, description: "foo", filename: "default.jpg" });
        await Product.create({ name: "Vodka", price: 100, description: "foo", filename: "default.jpg" });

        const response = await request(app).get("/products");

        expect(response.status).toBe(200);
    });
});

describe("ProductUpdate", () => {
    beforeEach(async () => {
        await Product.deleteMany({});
    });

    afterAll(async () => {
        await Product.deleteMany({});
    });

    it("should not update a product without name", async () => {
        const product = await Product.create({ name: "Cerveja", price: 10, description: "foo", filename: "default.jpg" });

        const response = await request(app)
            .put(`/products/${product._id}`)
            .send({ price: 15 });

        expect(response.status).toBe(401);
    });

    it("should not update a product without price", async () => {
        const product = await Product.create({ name: "Cerveja", price: 10, description: "foo", filename: "default.jpg" });

        const response = await request(app)
            .put(`/products/${product._id}`)
            .send({ name: "CERVEJA" , description: "foo", filename: "default.jpg"});

        expect(response.status).toBe(401);
    });

    it("should not update a product that not exists", async () => {
        const response = await request(app)
            .put(`/providers/6fd94d2bfe3977307c7b5aef`)
            .send({ name: "Cerveja", price: 15, description: "foo", filename: "default.jpg" });

        expect(response.status).toBe(404);
    });

    it("should update a product", async () => {
        const product = await Product.create({ name: "Cerveja", price: 10, description: "foo", filename: "default.jpg" });

        const response = await request(app)
            .put(`/products/${product._id}`)
            .send({ name: "Cerveja", price: 20, description: "foobar", filename: "default.jpg" });

        expect(response.status).toBe(200);
    });
});

describe("ProductDelete", () => {
    beforeEach(async () => {
        await Product.deleteMany({});
    });

    afterAll(async () => {
        await Product.deleteMany({});
    });

    it("should not delete a product that not exists", async () => {
        const response = await request(app).delete(
            "/products/6fd94d2bfe3977307c7b5aef"
        );

        expect(response.status).toBe(404);
    });

    it("should delete a product", async () => {
        const product = await Product.create({ name: "Cerveja", price: 10, description: "foo", filename: "default.jpg" });
        const url = `/products/${product._id}`;
        console.log(url);
        const response = await request(app).delete(url);

        expect(response.status).toBe(204);
    });
    
    // Increment with Image Filename tests
        // Send image: ok
        // Send empty image: fail
    // Increment with Description tests
        // Send with description: ok
        // Send without description: fail
});

afterAll(() => {
    mongoose.connection.close();
});
