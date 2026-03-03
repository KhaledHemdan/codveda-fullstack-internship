const express = require('express');
const cors = require('cors'); // Required to allow Task 3 Frontend to connect
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing [Objective: Level 1, Task 3]
app.use(express.json()); // Parses incoming JSON data [Objective: Level 1, Task 2]

// In-memory data store for the internship task
let products = [
    { id: 1, name: "Laptop", price: 1000 },
    { id: 2, name: "Mouse", price: 25 }
];

// --- API ROUTES [Objective: CRUD Operations] ---

// 1. READ: Get all products (GET)
app.get('/api/products', (req, res) => {
    res.status(200).json(products);
});

// 2. CREATE: Add a new product (POST)
app.post('/api/products', (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// 3. UPDATE: Modify an existing product (PUT)
app.put('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    product.name = req.body.name;
    product.price = req.body.price;
    res.status(200).json(product);
});

// 4. DELETE: Remove a product (DELETE)
app.delete('/api/products/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    products.splice(productIndex, 1);
    res.status(200).json({ message: "Product deleted successfully" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});