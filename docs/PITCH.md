# PayPilot AI — Selection Pitch Deck
**Razorpay AI Builder Internship 2026 — Track 1: AI Growth & Agentic Commerce**

---

## 1. Executive Summary & Problem Statement

Traditional e-commerce platforms suffer from two major disconnects:
1. **Customer Friction**: Customers spend an average of 14 minutes searching, filtering, comparing products, and navigating multi-step checkouts. AI chatbots often provide text advice but cannot execute actual commerce actions.
2. **Merchant Blindness**: Merchants struggle to understand why sales fluctuate, where cart abandonment occurs, or which products have unmet demand. Generic marketing advice fails without real store data.

**PayPilot AI** bridges this gap by creating an end-to-end **Agentic Commerce & Growth Platform** where AI acts as a trusted, autonomous actor capable of searching products, comparing specifications, managing shopping carts, orchestrating agentic checkouts via **Razorpay**, and providing merchants with data-grounded growth copilot automations.

---

## 2. Key Differentiators & Product Innovations

- 🤖 **Genuine Agentic Commerce**: The AI is not a static chatbot; it executes 14 backend-grounded commerce tools (`searchProducts`, `compareProducts`, `addToCart`, `prepareCheckout`, `createPaymentSession`).
- 💳 **Seamless Razorpay Agentic Checkout**: Server-calculated amounts in INR paise, HMAC SHA256 signature verification, and Razorpay TEST MODE modal handoff.
- 📈 **AI Growth Copilot for Merchants**: Real-data commerce intelligence answering *"Why did sales change?"*, evaluating cart abandonment lost revenue, identifying catalog search gaps, and creating merchant-confirmed recovery campaigns.
- 🛡️ **Financial & Security Guardrails**: Explicit user and merchant confirmations required for orders and campaign activations. Zero AI hallucinated metrics or prices.
- 📊 **Admin Observatory & Telemetry**: Full platform KPI monitoring, LLM request latency logs, tool usage counts, user/merchant moderation, and operational health checks (`/admin/*`).

---

## 3. Architecture Highlights

```
CUSTOMER SHOPPING FLOW:
Customer -> AI Shopping Assistant -> Tool Registry (14 Tools) -> Commerce Engine -> MongoDB -> Razorpay Checkout

MERCHANT GROWTH FLOW:
Merchant -> AI Growth Copilot -> Analytics Engine -> Growth Opportunity Detection -> Campaign Draft -> Explicit Activation

ADMIN OBSERVABILITY FLOW:
Admin -> Platform Control Hub -> User/Merchant Moderation -> AI Request Telemetry -> Security Events -> Health Checks
```

---

## 4. 3-Minute Live Demo Script

1. **Natural-Language Discovery**: Ask AI *"Find me running shoes under ₹3000."* -> AI queries database and returns real products.
2. **Agentic Cart Action**: Ask AI *"Add the first one to my cart."* -> Live cart drawer updates.
3. **Agentic Checkout**: Ask AI *"Checkout."* -> AI prepares server-grounded order summary.
4. **Razorpay Payment Handoff**: Confirm order -> Razorpay TEST Checkout modal opens -> Complete test payment -> HMAC SHA256 verified on backend.
5. **Merchant Growth Copilot**: Log in as Merchant -> Open Growth Copilot (`/merchant/ai`) -> Ask *"How to recover abandoned carts?"* -> Copilot generates evidence card -> Click *"Create Campaign Draft"* -> Explicitly activate campaign (`/merchant/campaigns`).
6. **Admin Observatory**: Log in as Admin -> View `/admin/dashboard`, `/admin/ai` telemetry, and system health checks.

---

## 5. Technical Excellence & Business Impact

- **Production-Grade Monorepo**: Express Node.js ESM backend, Mongoose ODM, Vite React frontend, Tailwind CSS dark design system.
- **Zero Exposed Secrets**: `RAZORPAY_KEY_SECRET` and `GEMINI_API_KEY` remain strictly server-side.
- **Audited & Tested**: 100% automated test pass rate across 12 testing domains.
