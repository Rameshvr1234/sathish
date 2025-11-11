const express = require('express');
const router = express.Router();

// Placeholder routes
router.post('/create-order', (req, res) => {
  res.json({ message: 'Create payment order - To be implemented' });
});

router.post('/verify', (req, res) => {
  res.json({ message: 'Verify payment - To be implemented' });
});

router.get('/transactions', (req, res) => {
  res.json({ message: 'Get transactions - To be implemented', data: [] });
});

module.exports = router;
