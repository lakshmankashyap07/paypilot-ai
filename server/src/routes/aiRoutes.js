import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  postChatMessage,
  createConversation,
  getConversations,
  getConversationById,
  deleteConversation
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rate limiter for AI chat requests (30 requests per 15 minutes)
const aiChatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Too many AI requests. Please wait a few minutes before asking again.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.use(protect);

router.post('/chat', aiChatLimiter, postChatMessage);
router.post('/conversations', createConversation);
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversationById);
router.delete('/conversations/:id', deleteConversation);

export default router;
