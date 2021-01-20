const Provider = require("../models/Provider");
const Product = require("../models/Product");
const Order = require("../models/Order");

module.exports = {
    async index(req, res) {
        const providers = await Provider.find();

        return res.status(200).json(providers);
    },

    async create(req, res) {
        const { name, user } = req.body;

        if (!name || !user) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        const existing_provider = await Provider.findOne({ user });
        if (existing_provider) {
            return res.status(403).send({ error: "Provider already exists!" });
        }

        const provider = await Provider.create({ name, user });
        if (!provider) {
            return res
                .status(500)
                .send({ error: "Failed to create provider!" });
        }

        return res.status(201).json(provider);
    },

    async read(req, res) {
        const { provider_id } = req.params;

        const provider = await Provider.findById(provider_id);

        if (!provider) {
            return res.status(404).send({ error: "Provider not found!" });
        }

        return res.status(200).json(provider);
    },

    async update(req, res) {
        const { provider_id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        const provider = await Provider.findByIdAndUpdate(
            provider_id,
            { name },
            { new: true }
        );
        if (!provider) {
            return res.status(404).send({ error: "Provider not found!" });
        }

        return res.status(200).json(provider);
    },

    async delete(req, res) {
        const { provider_id } = req.params;

        const provider = await Provider.findById(provider_id);

        if (!provider) {
            return res.status(404).send({ error: "Provider not found!" });
        }

        await provider.delete();

        return res.sendStatus(204);
    },

    async addProducts(req, res) {
        const { provider_id } = req.params;
        const { name, price, description, quantity } = req.body;

        if (!name || !price || !description) {
            return res
                .status(401)
                .send({ error: "Invalid request parameters!" });
        }

        const existing_product = await Product.findOne({ name });
        if (existing_product) {
            return res.status(403).send({ error: "Product already exists!" });
        }

        const clearProviders = [];
        clearProviders.push({ provider: provider_id });
        const product = await Product.create({
            name,
            price,
            description,
            providers: clearProviders,
        });
        if (!product) {
            return res.status(500).send({ error: "Failed to create product!" });
        }

        await Provider.findByIdAndUpdate(
            provider_id,
            { $push: { products: { product: product._id, quantity } } },
            { new: true }
        );

        return res.status(201).json(product);
    },

    async showProducts(req, res) {
        const { provider_id } = req.params;

        const provider = await Provider.findById(provider_id);
        if (!provider) {
            return res.status(404).send({ error: "Provider not found!" });
        }

        await provider.populate("products.product").execPopulate();

        return res.status(200).json(provider.products);
    },

    async removeProduct(req, res) {
        const { provider_id } = req.params;
        const { product } = req.body;

        const provider = await Provider.findByIdAndUpdate(
            provider_id,
            { $pull: { products: { product: product } } },
            { new: true }
        );

        await provider.update({
            $push: { products: { product: product, status: "archived" } },
        });

        if (!provider) {
            return res.status(404).send({ error: "Provider not found!" });
        }

        return res.status(200).json(provider.products);
    },

    async removeProductById(req, res) {
        const { provider_id, product_id } = req.params;
        if (!provider_id || !product_id ) {
            res.status(401).send({ error: "Invalid request parameters!", provider_id, product_id});
        }
        // Find provider
        const provider = await Provider.findById(provider_id);
        if (!provider) {
            return res.status(404).send({ error: "Provider not found!", parameters: { provider_id } });
        }
        // Find product
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).send({ error: "Product not found!", parameters: { product_id } });
        }

        // Update provider's product active status
        let updatedItem = null;
        console.log(product_id);
        let productList = provider.products;
        for (const item of productList) {
            console.log(`${item.product._id} ?= ${product_id}`);
            if (item.product._id == product_id) {
                item.status = "archived";       
                updatedItem = await provider.save( {isNew: false} );
                console.log(updatedItem);
            }
        }
        if (!updatedItem) {
            return res.status(500).send({error: "Failed to update product status"});            
        }

        return res.status(200).send(updatedItem);

    },

    async showOrders(req, res) {
        const { provider_id } = req.params;

        const orders = await Order.find({ provider: provider_id });

        return res.status(200).json(orders);
    },
    async getProductInfo(req, res) {
        // Retrieve and validate parameters
        const { provider_id, product_id } = req.params;
        if (!provider_id || !product_id) {
            return res.status(400).send({ error: "Missing parameters!", parameters: { provider_id, product_id } });
        }
        // Find provider and validate
        const provider = await Provider.findById(provider_id);
        if (!provider) {
            return res.status(404).send({ error: "Provider not found!", parameters: { provider_id, product_id } });
        }
        // Find product(s) on provider
        let productList = provider.products;
        productList.map((metaproduct) => {
            if (metaproduct.product._id == product_id) {
                return res.status(200).send(metaproduct);
            }
        });
        return res.status(404).send({ error: "Product not found!", parameters: { provider_id, product_id } });;

    },

    async updateProviderProduct(req, res) {

        // Retrieve and validate parameters
        const { product_id, provider_id } = req.params;
        const { name, price, description, quantity } = req.body;
        if (!provider_id || !product_id || !quantity || !name || !price || !description) {
            return res.status(400).send({ error: "Missing parameters!", parameters: { provider_id, product_id, quantity, name, price, description } });
        }
        // Find provider
        const provider = await Provider.findById(provider_id);
        if (!provider) {
            return res.status(404).send({ error: "Provider not found!", parameters: { provider_id } });
        }
        // Find product
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).send({ error: "Product not found!", parameters: { product_id } });
        }

        // Update product info
        const updatedProduct = await product.update({name, price, description});
        if (!updatedProduct) {
            return res.status(500).send({error: "Failed to update product"});            
        }

        // Update provider's product quantity
        let updatedItem = null;
        console.log(product_id);
        let productList = provider.products;
        for (const item of productList) {
            console.log(`${item.product._id} ?= ${product_id}`);
            if (item.product._id == product_id) {
                item.quantity = quantity;       
                updatedItem = await provider.save( {isNew: false} );
                console.log(updatedItem);
            }
        }
        if (!updatedItem) {
            return res.status(500).send({error: "Failed to update quantity counter"});            
        }

        return res.status(200).send(updatedItem);
    }
};
