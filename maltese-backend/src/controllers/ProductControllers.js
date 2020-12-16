const Product = require("../models/Product");

module.exports = {
    //Read
    async index(req, res) {
        const products = await Product.find();

        return res.status(200).json(products);
    },

    async create(req, res) {
        const { name, price } = req.body;

        if (!name || !price) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        const existing_product = await Product.findOne({ name });
        if (existing_product) {
            return res.status(403).send({ error: "Product already exists!" });
        }

        // Create the provider
        const created_product = await Product.create({ name, price });
        if (!created_product) {
            return res.status(500).send({ error: "Failed to create product!" });
        }

        return res.status(201).json(created_product);
    },

    async read(req, res) {
        const { product_id } = req.params;

        const product = await Product.findById(product_id);

        if (!product) {
            return res.status(404).send({ error: "Product not found!" });
        }
        return res.status(200).json(product);
    },

    async update(req, res) {
        const { product_id } = req.params;
        const { name, price } = req.body;

        if (!name || !price) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        let product = await Product.findByIdAndUpdate(
            product_id,
            { name, price },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ error: "Product not found!" });
        }

        return res.status(200).json(product);
    },

    async delete(req, res) {
        const { product_id } = req.params;

        let product = await Product.findById(product_id);

        if (!product)
            return res.status(404).json({ error: "Product not found!" });

        await product.delete();

        return res.sendStatus(204);
    },
};
