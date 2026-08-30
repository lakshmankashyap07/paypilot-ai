import express from 'express';
import {
  processGrowthChat,
  getConversations,
  getConversationById,
  getOpportunities,
  getDailySummary
} from '../controllers/growthCopilotController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require Authentication & Merchant/Admin Authorization
router.use(protect);
router.use(authorizeRoles('MERCHANT', 'ADMIN'));

router.post('/chat', processGrowthChat);
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversationById);
router.get('/opportunities', getOpportunities);
router.get('/daily-summary', getDailySummary);

export default router;
