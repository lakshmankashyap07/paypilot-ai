import Campaign from '../models/Campaign.js';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';

export const campaignService = {
  /**
   * Get Merchant Campaigns
   */
  async getCampaigns(merchantId, query = {}) {
    const filter = { merchant: merchantId };
    if (query.status) filter.status = query.status;

    const campaigns = await Campaign.find(filter).sort({ createdAt: -1 }).lean();
    return { campaigns };
  },

  /**
   * Get Single Campaign
   */
  async getCampaignById(merchantId, campaignId) {
    const campaign = await Campaign.findOne({ _id: campaignId, merchant: merchantId });
    if (!campaign) throw new Error('Campaign not found');
    return campaign;
  },

  /**
   * Create Campaign (Initially DRAFT or PENDING_APPROVAL)
   */
  async createCampaign(merchantId, campaignData) {
    const campaign = await Campaign.create({
      ...campaignData,
      merchant: merchantId,
      status: campaignData.status || 'DRAFT'
    });
    return campaign;
  },

  /**
   * Update Campaign
   */
  async updateCampaign(merchantId, campaignId, updateData) {
    const campaign = await Campaign.findOneAndUpdate(
      { _id: campaignId, merchant: merchantId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!campaign) throw new Error('Campaign not found or update failed');
    return campaign;
  },

  /**
   * Activate Campaign (Only after explicit merchant confirmation)
   */
  async activateCampaign(merchantId, campaignId) {
    const campaign = await Campaign.findOne({ _id: campaignId, merchant: merchantId });
    if (!campaign) throw new Error('Campaign not found');

    campaign.status = 'ACTIVE';
    campaign.startDate = new Date();
    await campaign.save();
    return campaign;
  },

  /**
   * Pause Campaign
   */
  async pauseCampaign(merchantId, campaignId) {
    const campaign = await Campaign.findOne({ _id: campaignId, merchant: merchantId });
    if (!campaign) throw new Error('Campaign not found');

    campaign.status = 'PAUSED';
    await campaign.save();
    return campaign;
  },

  /**
   * Delete Campaign
   */
  async deleteCampaign(merchantId, campaignId) {
    const result = await Campaign.deleteOne({ _id: campaignId, merchant: merchantId });
    if (result.deletedCount === 0) throw new Error('Campaign not found');
    return true;
  },

  /**
   * Target Segment Audience Preview
   */
  async getAudiencePreview(merchantId, segment) {
    const totalCustomers = await User.countDocuments({ role: 'CUSTOMER' });
    let count = 0;
    let estimatedValue = 0;

    switch (segment) {
      case 'CART_ABANDONER':
        const carts = await Cart.find().lean();
        const ordersCount = await Order.countDocuments();
        count = Math.max(0, carts.length - ordersCount);
        estimatedValue = count * 2500;
        break;
      case 'HIGH_VALUE_CUSTOMER':
        count = Math.round(totalCustomers * 0.15);
        estimatedValue = count * 15000;
        break;
      case 'NEW_CUSTOMER':
        count = Math.round(totalCustomers * 0.35);
        estimatedValue = count * 3000;
        break;
      case 'RETURNING_CUSTOMER':
      default:
        count = Math.round(totalCustomers * 0.5);
        estimatedValue = count * 8000;
        break;
    }

    return {
      segment,
      estimatedAudienceCount: count,
      estimatedOpportunityValue: estimatedValue
    };
  }
};

export default campaignService;
