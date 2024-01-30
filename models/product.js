const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
        type: String,
        required: true,
        },
        price: {
        type: Number,
        },
        description: {
        type: String,
        },
        image: {
        type: String,
        },
        category: {
        type: String,
        },
        quantity: {
        type: Number,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;