const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

// Update with your own MongoDB connection string:
const uri = 'mongodb://127.0.0.1:27017'; // or use MongoDB Atlas URI
const client = new MongoClient(uri);

let db;
async function connectMongo() {
    await client.connect();
    db = client.db('Quick Mart Database');
    console.log('🟢 MongoDB connected');
}
connectMongo();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve snacks.html etc.

// === API ROUTES ===

// 👤 Register User
app.post('/api/users/register', async (req, res) => {
    const { email, password } = req.body;
    const existing = await db.collection('users').findOne({ email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const result = await db.collection('users').insertOne({ email, password, addresses: [], payment: null });
    res.status(201).json({ userId: result.insertedId });
});

// 🔐 Login
app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await db.collection('users').findOne({ email, password });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    res.status(200).json({ userId: user._id });
});

// 🍪 Snacks
app.get('/api/products/snacks', async (req, res) => {
    const snacks = await db.collection('SnacksCategory').find({}).toArray();
    res.json(snacks);
});

// 🍔 Food
app.get('/api/products/food', async (req, res) => {
    const food = await db.collection('FoodCategory').find({}).toArray();
    res.json(food);
});

// 🛒 Grocery
app.get('/api/products/grocery', async (req, res) => {
    const grocery = await db.collection('GroceryCategory').find({}).toArray();
    res.json(grocery);
});

// 🧃 Beverages
app.get('/api/products/beverages', async (req, res) => {
    const beverages = await db.collection('BeveragesCategory').find({}).toArray();
    res.json(beverages);
});

// 🧾 Fake Purchase
app.post('/api/checkout', async (req, res) => {
    console.log('Order received:', req.body);
    res.json({ success: true, message: "✅ Fake order placed successfully!" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
