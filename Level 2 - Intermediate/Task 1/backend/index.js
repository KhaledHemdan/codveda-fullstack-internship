const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Allows React to talk to this server
app.use(express.json());

let products = [
    { id: 1, name: "Modern Desk", price: 150 },
    { id: 2, name: "Gaming Chair", price: 299 }
];

app.get('/api/products', (req, res) => res.json(products));

app.post('/api/products', (req, res) => {
    const newProduct = { id: Date.now(), ...req.body };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.delete('/api/products/:id', (req, res) => {
    products = products.filter(p => p.id !== parseInt(req.params.id));
    res.json({ message: "Deleted" });
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
