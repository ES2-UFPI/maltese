const Product = require("../models/Product");

module.exports = {
    //create
    async store (req, res){
        const{name, price} = req.body;

        let product = await Product.findOne({name});

        if(!product){
            product = await Product.create({name, price});
        }

        return res.status(201).json(product);
    },
    //Read
    async index(req, res){
        const products = await Product.find();

        return res.json(products);
    },
    
    async update(req, res){
        const{product_id} = req.params;
        const{price} = req.body;

        let product = await Product.findByIdAndUpdate(product_id,{price},{new:true});

        if(!product) return res.status(400).json({error: "Product not found"});

        return res.json(product);
    },

    async delete(req, res){
        const {product_id} = req.params;

        let product = await Product.findById(product_id);

        if(!product) return res.status(400).json({  error:  "product not found" });

        await product.delete();

        return res.sendStatus(204);
    }
};
