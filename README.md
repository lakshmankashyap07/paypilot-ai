# PayPilot AI — Agentic Commerce & Checkout Platform

[![Razorpay AI Builder Internship 2026](https://img.shields.io/badge/Razorpay%20AI%20Builder-Track%201%3A%20AI%20Growth%20%26%20Agentic%20Commerce-blueviolet)](https://razorpay.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![Status: Phase 5 Step 1 Completed](https://img.shields.io/badge/Phase%205%20Step%201-Completed-emerald)](file:///C:/Users/laksh/.gemini/antigravity-ide/brain/8c77185d-8983-47a4-889b-a7a4978aa62c/walkthrough.md)

**PayPilot AI** is a production-grade full-stack agentic commerce ecosystem built for the **Razorpay AI Builder Internship 2026** under **Track 1: AI Growth & Agentic Commerce**.

---

## 🛡️ Admin Observatory & Platform Control Hub

```
Admin User (role: ADMIN)
      │
      ▼
Admin Control Hub (/admin/*)
      ├── Overview Dashboard (/admin/dashboard) -> Platform KPIs & Revenue Telemetry
      ├── User Management (/admin/users) -> User Directory & Account Activation/Deactivation
      ├── Merchant Management (/admin/merchants) -> Merchant Directory & Volume Metrics
      ├── Catalog Moderation (/admin/products) -> Marketplace Product Soft-Deletion
      ├── Global Orders (/admin/orders) -> Order Monitoring & Fulfillment State
      ├── AI Observability (/admin/ai) -> Request Volume, Latency & Tool Execution Telemetry
      ├── Security & Audits (/admin/security) -> SecurityEvent & AdminActionLog Audit Trail
      └── Platform Health (/admin/health) -> Database, AI Engine & Razorpay Gateway Operational Status
```

---

## 🎬 3-Minute Demo Script

```
1. Open AI Shopping Assistant (/ai-shop)
2. Ask: "I need running shoes under ₹3000." (AI presents real database products)
3. Ask: "Add the first one to my cart." (Cart updates live)
4. Ask: "Checkout." (AI prepares server-grounded summary card)
5. Ask: "Yes, place the order." (AI creates order PP-YYYYMMDD-XXXXX)
6. Click: "Pay Securely with Razorpay" (Razorpay TEST Checkout modal opens)
7. Complete Test Payment (HMAC SHA256 signature verified on backend)
8. Switch to Merchant Portal (/merchant -> AI Growth Copilot /merchant/ai)
9. Ask Growth Copilot: "How to recover abandoned carts?" (Copilot presents evidence card)
10. Click: "Create Campaign Draft" -> Confirm activation -> Campaign is live!
11. Login as Admin -> View Admin Observatory (/admin/dashboard & /admin/ai) -> Inspect AI Telemetry & Health!
```

---

## 🚀 Architectural Progress

### Completed Phases
- **Part 1, Step 1 — Project Foundation & Architecture**: Monorepo layout, Express backend, Vite React client, dark theme visual system.
- **Part 1, Step 2 — Authentication & User System**: JWT authentication, bcryptjs hashing, HTTP-only cookies, role-based authorization (`CUSTOMER`, `MERCHANT`, `ADMIN`).
- **Part 1, Step 3 — Product Catalog, Search & Reviews**: Mongoose schemas, compound text index search, 100+ demo products in INR (₹), rating calculation, review CRUD.
- **Part 1, Step 4 — Wishlist, Cart, Addresses & Cart Events**: Server-validated cart, pricing engine, cart telemetry, single-default address exclusivity.
- **Part 1, Step 5 — Order Management & Merchant Portal**: Human-readable order numbers (`PP-YYYYMMDD-XXXXX`), checkout validation, atomic inventory safety, customer order history, 5-stage timeline, order cancellation, merchant product CRUD, inline stock editing, status transitions, low-stock alerts, and Merchant Dashboard.
- **Phase 2, Step 1 — AI Commerce Agent Core & Tool Calling**: Provider-agnostic AI layer (Google Gemini 1.5 API), system prompt guardrails, centralized Tool Registry (13 tools), multi-turn tool execution loop, untrusted argument validation, conversation storage (`Conversation`, `Message`, `AILog`).
- **Phase 2, Step 2 — Advanced AI Memory & Personalization**: Contextual memory across message turns, natural language product reference resolution ("first one", "cheaper option", "that product"), user preference tracking (`UserPreference.js`), data-backed explainable recommendations, 3-column AI Shopping interface with live cart side-panel, side-by-side comparison tables.
- **Phase 3, Step 1 — Razorpay Payment Infrastructure & Webhooks**: Official `razorpay` Node.js SDK integration in TEST MODE, server-side trusted amount calculation in INR paise (`₹1 = 100 paise`), human-readable payment numbers (`PAY-YYYYMMDD-XXXXX`), HMAC SHA256 signature verification, webhook raw body parser, idempotent event log (`PaymentEvent.js`), customer payment history, and merchant payment analytics.
- **Phase 3, Step 2 — Agentic Checkout & AI Payment Orchestration**: `CheckoutSession.js` state machine, `checkoutSessionService.js`, 4 extended AI Checkout Tools (`prepareCheckout`, `confirmCheckout`, `createPaymentSession`, `getPaymentStatus`), AI Chat Checkout & Payment UI Cards (`AICheckoutSummaryCard`, `AIPaymentActionCard`, `AIPaymentStatusCard`), explicit user confirmation safeguards, and end-to-end purchase flow.
- **Phase 4, Step 1 — Commerce Intelligence & Merchant Analytics Platform**: Real-data event tracking (`AnalyticsEvent.js`), 13 merchant analytics API endpoints, date range & source filtering, AI vs Web performance comparison, conversion funnels, search intelligence, inventory run-rate risk calculation, customer spend segments, and CSV exports.
- **Phase 4, Step 2 — AI Growth Copilot & Campaign Automation**: `GrowthConversation.js`, `Campaign.js`, `GrowthActionLog.js`, `growthPrompt.js`, 14 Growth Tools (`growthTools.js`), AI Growth Hub UI (`/merchant/ai`) with evidence cards, Marketing Campaign Management UI (`/merchant/campaigns`), explicit merchant confirmation safeguards, and audit logging.
- **Phase 5, Step 1 — Advanced Personalization Engine & Admin Observatory**: Transparent product recommendation ranking (+30 Category, +20 Brand, +15 Rating, +10 Stock), customer recommendation privacy controls (`/profile/preferences`), smart product similarity & alternatives (`findSimilarProducts`), `AIRequestLog.js`, `SecurityEvent.js`, `AdminActionLog.js`, and Admin Control Hub (`/admin/*`).

---

## 📡 API Endpoints Reference

### Admin Observatory Endpoints (`/api/admin`)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/dashboard` | ADMIN ONLY | Platform Overview KPIs (Users, Merchants, Products, Revenue, Payment Success Rate) |
| `GET` | `/users` | ADMIN ONLY | User accounts directory & role filter |
| `PATCH` | `/users/:id/status` | ADMIN ONLY | Activate / deactivate user account |
| `GET` | `/merchants` | ADMIN ONLY | Merchant directory, product counts & captured volume |
| `PATCH` | `/merchants/:id/status` | ADMIN ONLY | Activate / deactivate merchant account |
| `GET` | `/products` | ADMIN ONLY | Marketplace product catalog moderation |
| `PATCH` | `/products/:id/status` | ADMIN ONLY | Soft delete / restore catalog product (`active: true/false`) |
| `GET` | `/orders` | ADMIN ONLY | Global platform orders monitoring |
| `GET` | `/ai` | ADMIN ONLY | AI LLM request volume, response latency & tool execution telemetry |
| `GET` | `/security-events` | ADMIN ONLY | High-level security events log |
| `GET` | `/audit-logs` | ADMIN ONLY | Administrative action audit trail |
| `GET` | `/health` | ADMIN ONLY | System operational health check (Database, AI Provider, Razorpay API, Uptime) |

### Customer Personalization Endpoints (`/api/personalization`)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/home` | CUSTOMER | Get personalized customer homepage feeds |
| `GET` | `/products/:id/similar` | PUBLIC | Smart product similarity & alternatives |
| `GET` | `/preferences` | CUSTOMER | Fetch customer recommendation interests |
| `PATCH` | `/preferences/toggle` | CUSTOMER | Toggle personalization privacy (`enabled: true/false`) |
| `POST` | `/preferences/reset` | CUSTOMER | Reset recommendation interests to default |

---

## 💻 Environment Setup & Quick Start

```bash
# 1. Install Monorepo Dependencies
npm run install:all

# 2. Seed Users, Categories, and Products
npm run seed

# 3. Configure Razorpay TEST MODE credentials in server/.env
# RAZORPAY_KEY_ID=rzp_test_your_key_id
# RAZORPAY_KEY_SECRET=your_key_secret
# RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# 4. Start Backend Server (Port 5000)
npm run server

# 5. Start Client Vite Dev Server (Port 5173)
npm run client
```
