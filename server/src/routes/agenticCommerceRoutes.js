import express from 'express';
import {
  handleDealOptimizer,
  handlePostPurchaseQuery,
  handleReturnRequest,
  handleMerchantCopilot,
  handleMerchantCopilotQA,
  handleGenerateListingAI,
  handleOrderRisk,
  handleResetShoppingMemory,
  handleBudgetGuard
} from '../controllers/agenticCommerceController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Customer Agentic Routes
router.post('/deal-optimizer', handleDealOptimizer);
router.post('/budget-guard', handleBudgetGuard);
router.post('/post-purchase', handlePostPurchaseQuery);
router.post('/return-request', handleReturnRequest);
router.delete('/shopping-memory', handleResetShoppingMemory);

// Merchant Agentic Routes
router.get('/merchant/copilot', authorizeRoles('MERCHANT', 'ADMIN'), handleMerchantCopilot);
router.post('/merchant/copilot-qa', authorizeRoles('MERCHANT', 'ADMIN'), handleMerchantCopilotQA);
router.post('/merchant/generate-listing', authorizeRoles('MERCHANT', 'ADMIN'), handleGenerateListingAI);

// Admin / Merchant Risk Signals
router.get('/order-risk/:orderId', authorizeRoles('MERCHANT', 'ADMIN'), handleOrderRisk);

export default router;
