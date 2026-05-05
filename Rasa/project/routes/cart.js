const express = require('express');
const router = express.Router();

let cart = [];

// add to cart
router.post('/add', (req, res) => {
    cart.push(req.body);
    res.json({ message: "Added to cart", cart });
});

// get cart
router.get('/', (req, res) => {
    res.json(cart);
});

// remove item
router.delete('/:id', (req, res) => {
    cart = cart.filter(item => item.id != req.params.id);
    res.json(cart);
});

module.exports = router;
