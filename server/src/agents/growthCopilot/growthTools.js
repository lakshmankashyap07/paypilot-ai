import analyticsService from '../../services/analytics/analyticsService.js';
import campaignService from '../../services/campaignService.js';
import GrowthActionLog from '../../models/GrowthActionLog.js';

export const growthToolsRegistry = [
  // 1. Sales Summary
  {
    name: 'getSalesSummary',
    description: 'Get captured revenue, total orders, average order value, and daily sales trend from database records.',
    parameters: {
      type: 'OBJECT',
      properties: {
        range: { type: 'STRING', description: 'Timeframe: today, 7d, 30d, 90d (default 30d)' }
      }
    },
    async execute(args, context) {
      return await analyticsService.getSalesAnalytics(context.merchantId, context.role, { range: args.range || '30d' });
    }
  },

  // 2. Top Products
  {
    name: 'getTopProducts',
    description: 'Get top selling products ranked by revenue, units sold, and orders count.',
    parameters: {
      type: 'OBJECT',
      properties: {
        range: { type: 'STRING', description: 'Timeframe: 7d, 30d, 90d (default 30d)' }
      }
    },
    async execute(args, context) {
      return await analyticsService.getProductAnalytics(context.merchantId, context.role, { range: args.range || '30d' });
    }
  },

  // 3. Product Performance
  {
    name: 'getProductPerformance',
    description: 'Get detailed views, cart additions, orders count, and conversion rate for a specific product.',
    parameters: {
      type: 'OBJECT',
      properties: {
        productId: { type: 'STRING', description: 'Database ID of product' }
      },
      required: ['productId']
    },
    async execute(args, context) {
      const res = await analyticsService.getProductAnalytics(context.merchantId, context.role, {});
      const p = res.topProducts?.find((prod) => prod.id.toString() === args.productId) || res.topProducts?.[0];
      return { productPerformance: p || null };
    }
  },

  // 4. Cart Abandonment Insights
  {
    name: 'getCartAbandonmentInsights',
    description: 'Get abandoned cart counts, abandonment rate percentage, and estimated lost revenue.',
    parameters: { type: 'OBJECT', properties: {} },
    async execute(args, context) {
      return await analyticsService.getCartAbandonmentAnalytics(context.merchantId, context.role, {});
    }
  },

  // 5. Customer Segments
  {
    name: 'getCustomerSegments',
    description: 'Get customer counts and behavioral commerce segments (New, Returning, High Value, Cart Abandoner).',
    parameters: { type: 'OBJECT', properties: {} },
    async execute(args, context) {
      return await analyticsService.getCustomerAnalytics(context.merchantId, context.role, {});
    }
  },

  // 6. Conversion Funnel
  {
    name: 'getConversionFunnel',
    description: 'Get 5-stage conversion funnel breakdown (Product Views -> Cart -> Checkout -> Orders -> Payment Capture).',
    parameters: { type: 'OBJECT', properties: {} },
    async execute(args, context) {
      return await analyticsService.getFunnelAnalytics(context.merchantId, context.role, {});
    }
  },

  // 7. AI Commerce Performance
  {
    name: 'getAICommercePerformance',
    description: 'Get AI-assisted revenue, orders, and conversion rate comparison vs traditional web shopping.',
    parameters: { type: 'OBJECT', properties: {} },
    async execute(args, context) {
      return await analyticsService.getAIMetrics(context.merchantId, context.role, {});
    }
  },

  // 8. Search Insights
  {
    name: 'getSearchInsights',
    description: 'Get search query volume and zero-result search terms indicating catalog gaps.',
    parameters: { type: 'OBJECT', properties: {} },
    async execute(args, context) {
      return await analyticsService.getSearchAnalytics(context.merchantId, context.role, {});
    }
  },

  // 9. Inventory Risks
  {
    name: 'getInventoryRisks',
    description: 'Get low-stock products, stockout risk levels, and sales velocity.',
    parameters: { type: 'OBJECT', properties: {} },
    async execute(args, context) {
      return await analyticsService.getInventoryAnalytics(context.merchantId, context.role, {});
    }
  },

  // 10. Customer Value Insights
  {
    name: 'getCustomerValueInsights',
    description: 'Get repeat purchase rate and customer spend distribution.',
    parameters: { type: 'OBJECT', properties: {} },
    async execute(args, context) {
      return await analyticsService.getCustomerAnalytics(context.merchantId, context.role, {});
    }
  },

  // 11. Identify Growth Opportunities
  {
    name: 'identifyGrowthOpportunities',
    description: 'Analyze database analytics and return prioritized growth opportunity cards with problem, priority, metric, and evidence points.',
    parameters: { type: 'OBJECT', properties: {} },
    async execute(args, context) {
      const abandon = await analyticsService.getCartAbandonmentAnalytics(context.merchantId, context.role, {});
      const inv = await analyticsService.getInventoryAnalytics(context.merchantId, context.role, {});
      const search = await analyticsService.getSearchAnalytics(context.merchantId, context.role, {});

      const opportunities = [
        {
          type: 'HIGH_CART_ABANDONMENT',
          priority: 'HIGH',
          title: 'High Cart Abandonment Detected',
          metric: `${abandon.abandonmentRate}% Abandonment Rate`,
          evidence: [`${abandon.abandonedCount} abandoned carts`, `₹${abandon.estimatedLostRevenue.toLocaleString('en-IN')} estimated lost revenue`],
          recommendation: 'Create a 10% limited-time recovery offer targeting abandoned-cart customers.',
          campaignType: 'CART_RECOVERY'
        },
        {
          type: 'ZERO_RESULT_SEARCH',
          priority: 'MEDIUM',
          title: 'Unmet Demand in Search Queries',
          metric: `${search.zeroResultSearches?.length || 2} Gaps Identified`,
          evidence: search.zeroResultSearches?.map((s) => `"${s.term}" (${s.count} searches)`) || [],
          recommendation: 'Add high-demand products like wireless gaming chairs to capture search traffic.',
          campaignType: 'PRODUCT_PROMOTION'
        },
        {
          type: 'LOW_STOCK_RISK',
          priority: inv.lowStockRisks?.length > 0 ? 'HIGH' : 'LOW',
          title: 'Stockout Risk on Fast Sellers',
          metric: `${inv.lowStockCount} Products Low in Stock`,
          evidence: inv.lowStockRisks?.map((r) => `${r.name} (${r.stock} left)`) || [],
          recommendation: 'Restock fast-selling inventory before marketing campaigns trigger additional demand.',
          campaignType: 'LOW_STOCK'
        }
      ];

      return { opportunities };
    }
  },

  // 12. Create Campaign Draft
  {
    name: 'createCampaignDraft',
    description: 'Create a marketing campaign draft (status: DRAFT). Requires explicit merchant confirmation before activation.',
    parameters: {
      type: 'OBJECT',
      properties: {
        name: { type: 'STRING', description: 'Campaign title' },
        type: { type: 'STRING', description: 'CART_RECOVERY, PRODUCT_PROMOTION, CUSTOMER_RETENTION, etc.' },
        targetSegment: { type: 'STRING', description: 'Target audience segment' },
        discountValue: { type: 'NUMBER', description: 'Discount percentage or amount' }
      },
      required: ['name', 'type', 'discountValue']
    },
    async execute(args, context) {
      const campaign = await campaignService.createCampaign(context.merchantId, {
        name: args.name,
        type: args.type || 'CART_RECOVERY',
        targetSegment: args.targetSegment || 'CART_ABANDONER',
        discountType: 'PERCENTAGE',
        discountValue: args.discountValue || 10,
        status: 'DRAFT',
        createdBy: 'AI_COPILOT'
      });

      await GrowthActionLog.create({
        merchant: context.merchantId,
        conversation: context.conversationId,
        action: 'CAMPAIGN_DRAFT_CREATED',
        target: campaign.name,
        confirmedByMerchant: false
      });

      return {
        campaign,
        message: `Campaign draft "${campaign.name}" created with 10% offer! Status: DRAFT. Ask "Activate campaign" to launch.`
      };
    }
  },

  // 13. Activate Campaign
  {
    name: 'activateCampaign',
    description: 'Activate an existing campaign draft ONLY after explicit merchant confirmation ("Yes", "Activate campaign").',
    parameters: {
      type: 'OBJECT',
      properties: {
        campaignId: { type: 'STRING', description: 'Database ObjectId of campaign to activate' }
      },
      required: ['campaignId']
    },
    async execute(args, context) {
      const campaign = await campaignService.activateCampaign(context.merchantId, args.campaignId);

      await GrowthActionLog.create({
        merchant: context.merchantId,
        conversation: context.conversationId,
        action: 'CAMPAIGN_ACTIVATED',
        target: campaign.name,
        confirmedByMerchant: true
      });

      return {
        campaign,
        message: `Campaign "${campaign.name}" is now ACTIVE!`
      };
    }
  },

  // 14. Get Campaign Performance
  {
    name: 'getCampaignPerformance',
    description: 'Get performance metrics (views, clicks, orders, revenue) for a merchant campaign.',
    parameters: {
      type: 'OBJECT',
      properties: {
        campaignId: { type: 'STRING', description: 'Database ObjectId of campaign' }
      },
      required: ['campaignId']
    },
    async execute(args, context) {
      const campaign = await campaignService.getCampaignById(context.merchantId, args.campaignId);
      return { metrics: campaign.metrics || { views: 0, clicks: 0, ordersCount: 0, revenueGenerated: 0 } };
    }
  }
];

export const getGrowthToolHandler = (name) => {
  const tool = growthToolsRegistry.find((t) => t.name === name);
  return tool ? tool.execute : null;
};
