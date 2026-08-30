import express from 'express';
import {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  activateCampaign,
  pauseCampaign,
  deleteCampaign
} from '../controllers/campaignController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require Authentication & Merchant/Admin Authorization
router.use(protect);
router.use(authorizeRoles('MERCHANT', 'ADMIN'));

router.get('/', getCampaigns);
router.post('/', createCampaign);
router.get('/:id', getCampaignById);
router.put('/:id', updateCampaign);
router.patch('/:id/activate', activateCampaign);
router.patch('/:id/pause', pauseCampaign);
router.delete('/:id', deleteCampaign);

export default router;
