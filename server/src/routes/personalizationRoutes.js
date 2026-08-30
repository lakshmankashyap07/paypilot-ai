import express from 'express';
import {
  getHomePageFeeds,
  getSimilarProducts,
  getUserPreferences,
  updateUserPreferences,
  resetUserPreferences,
  togglePersonalization
} from '../controllers/personalizationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / Semi-Public Similar Products
router.get('/products/:id/similar', getSimilarProducts);

// Protected Customer Preference Endpoints
router.use(protect);
router.get('/home', getHomePageFeeds);
router.get('/preferences', getUserPreferences);
router.put('/preferences', updateUserPreferences);
router.post('/preferences/reset', resetUserPreferences);
router.patch('/preferences/toggle', togglePersonalization);

export default router;
