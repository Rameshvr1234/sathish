const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getLocationsByRegion,
  incrementView,
  getMyProperties
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getProperties);
router.get('/search/locations/:region', getLocationsByRegion);
router.get('/:id', getProperty);
router.post('/:id/increment-view', incrementView);

// Protected routes
router.post('/', protect, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);
router.get('/user/my-properties', protect, getMyProperties);

module.exports = router;
