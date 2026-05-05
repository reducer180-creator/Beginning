const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST a new order
router.post('/', async (req, res) => {
    try {
        const { customer, items, totalAmount } = req.body;
        
        // Basic validation
        if (!customer || !items || items.length === 0) {
            return res.status(400).json({ error: 'Customer details and items are required' });
        }

        const newOrder = new Order({
            customer,
            items,
            totalAmount
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({ message: 'Order placed successfully', orderId: savedOrder._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all orders (for admin dashboard later)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
