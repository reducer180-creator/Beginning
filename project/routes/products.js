const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// filter by category name (Daily Use, Kitchen Essentials, etc)
router.get('/category/:categoryName', async (req, res) => {
    try {
        const categoryName = decodeURIComponent(req.params.categoryName);
        // Use a case-insensitive regex for category matching
        const products = await Product.find({ 
            category: { $regex: new RegExp(`^${categoryName}$`, 'i') } 
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// filter by type (statue, cookware, serving, decor)
router.get('/type/:type', async (req, res) => {
    try {
        const products = await Product.find({ type: req.params.type });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// filter by price
router.get('/price/:price', async (req, res) => {
    try {
        const price = parseInt(req.params.price);
        const products = await Product.find({ price: { $lte: price } });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
