const express = require('express');
const router = express.Router();
const { getAllBranches } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

// Get all branches (public or protected based on requirements)
router.get('/', getAllBranches);

module.exports = router;
