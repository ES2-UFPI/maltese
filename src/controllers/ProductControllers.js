const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

module.exports = {
    async index(req, res) {
        const products = await Product.find();

        return res.status(200).json(products);
    },

    async create(req, res) {
        let filename = "";
        
        const { name, price, description } = req.body;
        if (req.file === undefined) {
            filename = "testing";
        } else {
            filename = req.file.filename;
        }

        if (!name || !price || !description) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        const existing_product = await Product.findOne({ name });
        if (existing_product) {
            return res.status(403).send({ error: "Product already exists!" });
        }

        const product = await Product.create({
            name,
            price,
            description,
            image: filename,
        });
        if (!product) {
            return res.status(500).send({ error: "Failed to create product!" });
        }

        return res.status(201).json(product);
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
        const { name, price, description } = req.body;

        if (!name || !price || !description) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        let product = await Product.findByIdAndUpdate(
            product_id,
            { name, price, description },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ error: "Product not found!" });
        }

        return res.status(200).json(product);
    },

    async delete(req, res) {
        const { product_id } = req.params;

        const product = await Product.findById(product_id);

        if (!product)
            return res.status(404).json({ error: "Product not found!" });

        if (product.image) {
            const imagePath = path.resolve(
                __dirname,
                "..",
                "..",
                "uploads",
                product.image
            );
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.log("Failed to delete: " + err);
                } else {
                    console.log("Successfully deleted");
                }
            });
        }
        await product.delete();

        return res.sendStatus(204);
    },
};
