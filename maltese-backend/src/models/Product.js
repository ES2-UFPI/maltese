const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: String,
        image: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
    }
);

ProductSchema.virtual("image_url").get(function () {
    return `http://localhost:3333/files/${this.image}`;
});

module.exports = mongoose.model("Product", ProductSchema);
