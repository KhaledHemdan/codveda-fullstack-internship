const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory data store for the internship task
let products = [
    { id: 1, name: "Laptop", price: 1000 },
    { id: 2, name: "Mouse", price: 25 }
];

// READ: Get all products (GET)
app.get('/api/products', (req, res) => {
    res.status(200).json(products);
});

// CREATE: Add a new product (POST)
app.post('/api/products', (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// UPDATE: Modify an existing product (PUT)
app.put('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = req.body.name;
    product.price = req.body.price;
    res.status(200).json(product);
});

// DELETE: Remove a product (DELETE)
app.delete('/api/products/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex === -1) return res.status(404).json({ message: "Product not found" });

    products.splice(productIndex, 1);
    res.status(200).json({ message: "Product deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});