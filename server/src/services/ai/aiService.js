import aiConfig from './aiConfig.js';
import geminiProvider from './geminiProvider.js';
import { getToolHandler } from '../../agents/tools/toolRegistry.js';
import contextService from './contextService.js';
import preferenceService from '../recommendation/preferenceService.js';
import checkoutSessionService from '../checkout/checkoutSessionService.js';
import Message from '../../models/Message.js';
import Conversation from '../../models/Conversation.js';
import AILog from '../../models/AILog.js';
import Order from '../../models/Order.js';

export const aiService = {
  /**
   * Process customer chat message through AI Agent & Tool Execution Loop
   */
  async processChatMessage({ userId, conversationId, userMessageText }) {
    const startTime = Date.now();
    const agentActivity = [];
    const productsCollected = [];

    // 1. Create or Find Conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, user: userId });
    }

    if (!conversation) {
      conversation = await Conversation.create({
        user: userId,
        title: userMessageText.length > 30 ? userMessageText.substring(0, 30) + '...' : userMessageText,
        lastMessageAt: new Date()
      });
    } else {
      conversation.lastMessageAt = new Date();
      await conversation.save();
    }

    const currentConvId = conversation._id.toString();

    // 2. Save User Message to Database
    await Message.create({
      conversation: currentConvId,
      user: userId,
      role: 'USER',
      content: userMessageText
    });

    // 3. Load Active Context & History
    const activeContext = await contextService.getShoppingContext(currentConvId);
    const userPrefs = await preferenceService.getUserPreferences(userId);

    const historyMessages = await Message.find({ conversation: currentConvId })
      .sort({ createdAt: 1 })
      .limit(14)
      .lean();

    agentActivity.push({
      type: 'thinking',
      message: 'Analyzing user intent & shopping context',
      timestamp: new Date()
    });

    let finalAssistantText = '';
    let executedToolCallsCount = 0;

    // Check if Gemini API Key is configured
    if (!aiConfig.isConfigured()) {
      // Fallback router if API key is not provided
      const fallbackResult = await this.handleFallbackAgentLoop(
        userId,
        currentConvId,
        userMessageText,
        agentActivity,
        activeContext,
        userPrefs
      );
      finalAssistantText = fallbackResult.text;
      if (fallbackResult.products) productsCollected.push(...fallbackResult.products);
      executedToolCallsCount = fallbackResult.toolCallsCount;

      await AILog.create({
        user: userId,
        conversation: currentConvId,
        status: 'UNCONFIGURED',
        toolCount: executedToolCallsCount,
        responseTimeMs: Date.now() - startTime
      });
    } else {
      // LIVE GEMINI AI MULTI-TURN TOOL LOOP
      let loopCount = 0;
      let currentMessages = historyMessages.map((m) => ({
        role: m.role,
        content: m.content,
        toolCalls: m.toolCalls,
        toolResults: m.toolResults
      }));

      while (loopCount < aiConfig.maxToolLoops) {
        loopCount++;

        try {
          const aiResponse = await geminiProvider.generateResponse({
            history: currentMessages
          });

          if (aiResponse.functionCalls && aiResponse.functionCalls.length > 0) {
            const toolResultsForTurn = [];
            const toolCallsForTurn = [];

            for (const fc of aiResponse.functionCalls) {
              executedToolCallsCount++;
              const toolName = fc.name;
              const toolArgs = fc.args || {};

              agentActivity.push({
                type: 'tool',
                tool: toolName,
                message: `Executing commerce tool '${toolName}'`,
                status: 'executing',
                timestamp: new Date()
              });

              toolCallsForTurn.push({ id: `call_${Date.now()}`, name: toolName, args: toolArgs });

              const handler = getToolHandler(toolName);
              if (!handler) {
                toolResultsForTurn.push({ name: toolName, result: { error: `Tool ${toolName} not found` }, success: false });
                continue;
              }

              try {
                const toolOutput = await handler(toolArgs, { userId, conversationId: currentConvId });
                toolResultsForTurn.push({ name: toolName, result: toolOutput, success: true });

                agentActivity.push({
                  type: 'result',
                  tool: toolName,
                  message: `Tool '${toolName}' executed successfully`,
                  status: 'success',
                  timestamp: new Date()
                });

                if (toolOutput.products && Array.isArray(toolOutput.products)) {
                  productsCollected.push(...toolOutput.products);
                } else if (toolOutput.recommendations && Array.isArray(toolOutput.recommendations)) {
                  productsCollected.push(...toolOutput.recommendations);
                }
              } catch (toolErr) {
                toolResultsForTurn.push({ name: toolName, result: { error: toolErr.message }, success: false });
                agentActivity.push({
                  type: 'error',
                  tool: toolName,
                  message: `Tool '${toolName}' failed: ${toolErr.message}`,
                  status: 'error',
                  timestamp: new Date()
                });
              }
            }

            currentMessages.push({ role: 'ASSISTANT', content: '', toolCalls: toolCallsForTurn });
            currentMessages.push({ role: 'TOOL', content: JSON.stringify(toolResultsForTurn), toolResults: toolResultsForTurn });
          } else {
            finalAssistantText = aiResponse.text || '';
            break;
          }
        } catch (genErr) {
          console.warn('Gemini generation error, switching to contextual fallback router:', genErr.message);
          const fallbackResult = await this.handleFallbackAgentLoop(
            userId,
            currentConvId,
            userMessageText,
            agentActivity,
            activeContext,
            userPrefs
          );
          finalAssistantText = fallbackResult.text;
          if (fallbackResult.products) productsCollected.push(...fallbackResult.products);
          executedToolCallsCount = fallbackResult.toolCallsCount;
          break;
        }
      }

      await AILog.create({
        user: userId,
        conversation: currentConvId,
        status: 'SUCCESS',
        toolCount: executedToolCallsCount,
        responseTimeMs: Date.now() - startTime
      });
    }

    // Deduplicate collected products
    const uniqueProducts = [];
    const seenIds = new Set();
    for (const p of productsCollected) {
      const pId = (p.id || p._id || '').toString();
      if (pId && !seenIds.has(pId)) {
        seenIds.add(pId);
        uniqueProducts.push(p);
      }
    }

    // Ensure finalAssistantText is never empty or generic "I have processed your request."
    if (!finalAssistantText || finalAssistantText.trim() === '' || finalAssistantText.includes('processed your request')) {
      finalAssistantText = this.synthesizeNaturalAssistantResponse(
        userMessageText,
        uniqueProducts,
        agentActivity,
        activeContext
      );
    }

    // 4. Save Assistant Response Message
    const assistantMessage = await Message.create({
      conversation: currentConvId,
      user: userId,
      role: 'ASSISTANT',
      content: finalAssistantText,
      agentActivity,
      products: uniqueProducts
    });

    return {
      conversationId: currentConvId,
      message: assistantMessage,
      products: uniqueProducts,
      agentActivity
    };
  },

  /**
   * Synthesize rich, natural conversational AI response using product data & context
   */
  synthesizeNaturalAssistantResponse(userText = '', products = [], agentActivity = [], activeContext = {}) {
    const textLower = userText.toLowerCase().trim();

    // 1. Simple Greetings
    if (['hi', 'hello', 'hey', 'greetings', 'good morning', 'good evening', 'hi there'].includes(textLower)) {
      return "Hi! I'm PayPilot AI, your shopping assistant. What are you looking for today?";
    }

    // 2. Open-ended conversational queries without specific filters
    if (textLower === 'i need a laptop' || textLower === 'find me a laptop' || textLower === 'show me laptops') {
      if (products && products.length > 0) {
        const top = products.slice(0, 3);
        const list = top.map((p, i) => `${i + 1}. **${p.name}**\n   ₹${p.price?.toLocaleString('en-IN')}${p.rating ? ` | ${p.rating}★` : ''}\n   ${p.whyRecommended || 'Great performance & build quality.'}`).join('\n\n');
        return `Sure! Here are top laptops available in our store:\n\n${list}\n\nWhat is your budget and primary use case? I can help you filter further!`;
      }
      return "Sure! What's your budget and what will you mainly use it for? (e.g. gaming, work, coding, under ₹50,000)";
    }

    // 3. Products Found (Laptops, Smartphones, Shoes, Headphones, etc.)
    if (products && products.length > 0) {
      const topProducts = products.slice(0, 4);

      let topic = 'products';
      if (textLower.includes('laptop')) topic = 'laptops';
      else if (textLower.includes('phone') || textLower.includes('mobile')) topic = 'smartphones';
      else if (textLower.includes('shoe')) topic = 'shoes';
      else if (textLower.includes('headphone')) topic = 'headphones';

      const productListStr = topProducts.map((p, idx) => {
        let line = `${idx + 1}. **${p.name}**\n   ₹${p.price?.toLocaleString('en-IN')}`;
        if (p.originalPrice && p.originalPrice > p.price) {
          line += ` ~₹${p.originalPrice.toLocaleString('en-IN')}~ (${p.discount || 0}% OFF)`;
        }
        if (p.rating) line += ` | ${p.rating}★`;
        if (p.whyRecommended) line += `\n   ${p.whyRecommended}`;
        return line;
      }).join('\n\n');

      return `Sure! Here are top ${topic} matching your request:\n\n${productListStr}\n\nI can also compare these based on:\n• Price\n• Performance\n• Rating\n• Gaming\n• Battery life`;
    }

    // 4. Check Executed Tools
    const executedTools = agentActivity ? agentActivity.filter((a) => a.type === 'result').map((a) => a.tool) : [];

    if (executedTools.includes('viewCart')) {
      return "Here is what is currently in your shopping cart! Check your items, quantities, and totals in the side panel.";
    }

    if (executedTools.includes('compareProducts')) {
      return "Here is a side-by-side comparison of the selected products based on price, rating, discount, and specifications.";
    }

    if (executedTools.includes('prepareCheckout')) {
      return "Your cart items have been validated and order summary prepared. Review your total and click 'Confirm & Place Order' when ready!";
    }

    if (executedTools.includes('confirmCheckout')) {
      return "Your order has been created successfully! You can now complete secure payment via Razorpay.";
    }

    if (textLower.includes('cart') || textLower.includes('what\'s in my cart')) {
      return "You can view your active cart items in the right panel anytime or click 'Checkout' to place your order.";
    }

    // 5. Default Friendly Fallback
    return "I searched our catalog for your request. What specific category, brand, or price range would you like to explore?";
  },

  /**
   * Contextual Intent Router Fallback (Memory & Payment Aware)
   */
  async handleFallbackAgentLoop(userId, conversationId, messageText, agentActivity, activeContext, userPrefs) {
    const text = messageText.toLowerCase().trim();
    let responseText = '';
    const products = [];
    let toolCallsCount = 0;

    const currentCat = activeContext?.shoppingState?.category || '';

    if (text.includes('did my payment') || text.includes('payment status') || text.includes('payment go through')) {
      toolCallsCount++;
      agentActivity.push({ type: 'tool', tool: 'getPaymentStatus', message: 'Querying backend payment & order status', status: 'executing' });
      const latestOrder = await Order.findOne({ user: userId }).sort({ createdAt: -1 });
      if (latestOrder) {
        const pStatus = await checkoutSessionService.getPaymentStatus(userId, latestOrder._id);
        agentActivity.push({ type: 'result', tool: 'getPaymentStatus', message: `Verified Payment Status: ${pStatus.paymentStatus}`, status: 'success' });
        responseText = `Yes! Payment for Order ${pStatus.orderNumber} is confirmed as ${pStatus.paymentStatus}. Order status: ${pStatus.orderStatus}. Total amount paid: ₹${pStatus.amount}.`;
      } else {
        responseText = `No recent order payment found in your account.`;
      }
    } else if (text.includes('cheaper') || text.includes('lower price') || text.includes('cheapest')) {
      toolCallsCount++;
      agentActivity.push({ type: 'tool', tool: 'searchProducts', message: 'Searching for lower-priced alternatives in MongoDB', status: 'executing' });
      const searchHandler = getToolHandler('searchProducts');
      const res = await searchHandler({ category: currentCat, maxPrice: 3000, limit: 4 }, { userId, conversationId });
      products.push(...(res.products || []));
      agentActivity.push({ type: 'result', tool: 'searchProducts', message: 'Found cheaper alternative products', status: 'success' });
      responseText = `I found lower-priced alternatives matching your shopping context in our catalog:`;
    } else if (text.includes('better rated') || text.includes('highest rating') || text.includes('best rated')) {
      toolCallsCount++;
      agentActivity.push({ type: 'tool', tool: 'recommendProducts', message: 'Searching for higher-rated options', status: 'executing' });
      const recHandler = getToolHandler('recommendProducts');
      const res = await recHandler({ category: currentCat, minimumRating: 4.5, limit: 4 }, { userId, conversationId });
      products.push(...(res.recommendations || []));
      agentActivity.push({ type: 'result', tool: 'recommendProducts', message: 'Found top-rated recommendations', status: 'success' });
      responseText = `Here are the highest-rated top options in ${currentCat || 'our store'}:`;
    } else if (text.includes('add that') || text.includes('add the first') || text.includes('add to cart') || text.includes('add best')) {
      toolCallsCount++;
      agentActivity.push({ type: 'tool', tool: 'addToCart', message: 'Resolving product reference & adding to cart', status: 'executing' });
      const cartHandler = getToolHandler('addToCart');
      try {
        const res = await cartHandler({ productId: 'first one', quantity: 1 }, { userId, conversationId });
        agentActivity.push({ type: 'result', tool: 'addToCart', message: 'Product added to cart', status: 'success' });
        responseText = `Added the product to your cart! You now have ${res.cartSummary.itemCount} items in your cart.`;
      } catch (e) {
        responseText = `Failed to add product to cart: ${e.message}`;
      }
    } else if (text.includes('running shoes') || text.includes('shoes')) {
      toolCallsCount++;
      agentActivity.push({ type: 'tool', tool: 'searchProducts', message: 'Searching catalog for running shoes', status: 'executing' });
      const searchHandler = getToolHandler('searchProducts');
      const res = await searchHandler({ category: 'Shoes', maxPrice: 5000, limit: 4 }, { userId, conversationId });
      products.push(...(res.products || []));
      agentActivity.push({ type: 'result', tool: 'searchProducts', message: `Found ${res.total || res.products?.length || 0} shoes`, status: 'success' });
      responseText = `Here are top footwear options matching your request:`;
    } else if (text.includes('laptop') || text.includes('laptops')) {
      toolCallsCount++;
      agentActivity.push({ type: 'tool', tool: 'searchProducts', message: 'Searching catalog for laptops', status: 'executing' });
      const searchHandler = getToolHandler('searchProducts');
      let budget = 60000;
      const priceMatch = text.match(/(?:under|below|less than|budget of)?\s*(?:₹|rs\.?|inr)?\s*(\d+000)/i);
      if (priceMatch) budget = parseInt(priceMatch[1], 10);
      const res = await searchHandler({ category: 'Laptops', maxPrice: budget, limit: 4 }, { userId, conversationId });
      products.push(...(res.products || []));
      agentActivity.push({ type: 'result', tool: 'searchProducts', message: `Found ${res.total || res.products?.length || 0} laptops`, status: 'success' });
      
      const productListStr = (res.products || []).slice(0, 3).map((p, idx) =>
        `${idx + 1}. **${p.name}**\n   ₹${p.price?.toLocaleString('en-IN')}${p.rating ? ` | ${p.rating}★` : ''}\n   ${p.description || 'Great performance & build quality.'}`
      ).join('\n\n');

      responseText = `Sure! Here are top laptops under ₹${budget.toLocaleString('en-IN')}:\n\n${productListStr}\n\nI can also compare these based on:\n• Price\n• Performance\n• Rating\n• Gaming\n• Battery life`;
    } else if (text.includes('headphones') || text.includes('headphone')) {
      toolCallsCount++;
      agentActivity.push({ type: 'tool', tool: 'searchProducts', message: 'Searching catalog for headphones', status: 'executing' });
      const searchHandler = getToolHandler('searchProducts');
      const res = await searchHandler({ category: 'Headphones', maxPrice: 5000, limit: 4 }, { userId, conversationId });
      products.push(...(res.products || []));
      agentActivity.push({ type: 'result', tool: 'searchProducts', message: `Found ${res.total || res.products?.length || 0} headphones`, status: 'success' });
      responseText = `Here are top headphones in store matching your request:`;
    } else if (text.includes('cart total') || text.includes('what\'s in my cart') || text.includes('view cart') || text.includes('my cart')) {
      toolCallsCount++;
      agentActivity.push({ type: 'tool', tool: 'viewCart', message: 'Fetching user shopping cart', status: 'executing' });
      const cartHandler = getToolHandler('viewCart');
      const res = await cartHandler({}, { userId, conversationId });
      agentActivity.push({ type: 'result', tool: 'viewCart', message: 'Cart retrieved', status: 'success' });
      responseText = `Your current shopping cart contains ${res.cart?.items?.length || 0} items. Total Amount: ₹${res.cart?.total || 0}.`;
    } else if (text.includes('checkout')) {
      toolCallsCount++;
      agentActivity.push({ type: 'tool', tool: 'prepareCheckout', message: 'Validating checkout readiness & preparing server totals', status: 'executing' });
      const prepHandler = getToolHandler('prepareCheckout');
      try {
        const prepRes = await prepHandler({}, { userId, conversationId });
        agentActivity.push({ type: 'result', tool: 'prepareCheckout', message: 'Checkout summary prepared', status: 'success' });
        responseText = `Your cart is validated and ready for order creation! Subtotal: ₹${prepRes.summary.subtotal}, Tax: ₹${prepRes.summary.tax}, Total: ₹${prepRes.summary.total}. Shipping to ${prepRes.summary.addressSnapshot.fullName}, ${prepRes.summary.addressSnapshot.city}. Would you like me to place the order now?`;
      } catch (e) {
        responseText = `Checkout preparation notice: ${e.message}`;
      }
    } else if (text.includes('yes') || text.includes('place order') || text.includes('confirm') || text.includes('buy this')) {
      toolCallsCount++;
      agentActivity.push({ type: 'tool', tool: 'confirmCheckout', message: 'Placing order in MongoDB after explicit user confirmation', status: 'executing' });
      const confirmHandler = getToolHandler('confirmCheckout');
      try {
        const confirmRes = await confirmHandler({}, { userId, conversationId });
        agentActivity.push({ type: 'result', tool: 'confirmCheckout', message: `Order ${confirmRes.order.orderNumber} created`, status: 'success' });
        responseText = `Your order ${confirmRes.order.orderNumber} has been created successfully for ₹${confirmRes.order.total}! Payment status is PENDING. You can now complete secure payment via Razorpay.`;
      } catch (e) {
        responseText = `Could not place order: ${e.message}`;
      }
    } else if (text === 'hi' || text === 'hello' || text === 'hey' || text === 'hi there') {
      responseText = "Hi! I'm PayPilot AI, your shopping assistant. What are you looking for today?";
    } else {
      toolCallsCount++;
      agentActivity.push({ type: 'tool', tool: 'searchProducts', message: 'Searching catalog', status: 'executing' });
      const searchHandler = getToolHandler('searchProducts');
      const res = await searchHandler({ limit: 4 }, { userId, conversationId });
      products.push(...(res.products || []));
      responseText = `I'm your PayPilot AI Commerce Agent! What are you looking for today? You can ask me for laptops, smartphones, running shoes, compare options, or view your cart! Here are featured products from our catalog:`;
    }

    return { text: responseText, products, toolCallsCount };
  }
};

export default aiService;
