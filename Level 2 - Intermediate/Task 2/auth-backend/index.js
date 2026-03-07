const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "codveda_secret_key";
const users = []; // Temporary data store

// 1. SIGNUP (Hash Password)
app.post('/api/signup', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { username: req.body.username, password: hashedPassword, role: 'admin' }; 
    users.push(user);
    res.status(201).json({ message: "User registered!" });
});

// 2. LOGIN (Generate JWT)
app.post('/api/login', async (req, res) => {
    const user = users.find(u => u.username === req.body.username);
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ username: user.username, role: user.role }, SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// 3. PROTECTED ROUTE
app.get('/api/admin-data', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: "No token provided" });
    
    try {
        const decoded = jwt.verify(token, SECRET);
        if (decoded.role !== 'admin') return res.status(403).json({ message: "Not an admin" });
        res.json({ secretData: "This is sensitive admin information!" });
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
});

app.listen(3000, () => console.log("Backend: http://localhost:3000"));
