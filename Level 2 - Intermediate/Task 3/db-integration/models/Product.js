const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'], // Data Validation
        trim: true,
        index: true // Indexing for faster searching
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'] // Data Validation
    },
    category: {
        type: String,
        default: 'General',
        index: true // Optimization technique
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Adding a compound index for optimization
ProductSchema.index({ name: 1, category: 1 });

module.exports = mongoose.model('Product', ProductSchema);