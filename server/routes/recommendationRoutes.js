const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  updateInterests,
  getTrending
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRecommendations);
router.put('/interests', protect, updateInterests);
router.get('/trending', getTrending);

module.exports = router;