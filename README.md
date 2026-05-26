# Throttlr 🛡️

[![NPM Version](https://img.shields.io/npm/v/@throttlr/sdk?logo=npm&color=orange)](https://www.npmjs.com/package/@throttlr/sdk)
[![NPM Downloads](https://img.shields.io/npm/dm/@throttlr/sdk?logo=npm&color=orange)](https://www.npmjs.com/package/@throttlr/sdk)
[![License](https://img.shields.io/npm/l/@throttlr/sdk?color=blue)](https://github.com/JejurkarYash/ratelimiter-microservice/blob/main/LICENSE)
[![Turborepo](https://img.shields.io/badge/built%20with-Turborepo-09111e?logo=turborepo)](https://turbo.build/)

Throttlr is an enterprise-grade, high-performance distributed rate-limiting microservice and SDK. Built as a monorepo with Turborepo, it enables real-time rate limiting, rule configuration, and detailed request analytics via an elegant Next.js dashboard.

---

## 🏗️ Monorepo Architecture

The project is structured as a Turborepo monorepo to ensure shared configuration, fast builds, and modularity:

```
├── apps
│   ├── api          # Express.js backend (Rule management & SDK Check endpoint)
│   ├── dashboard    # Next.js Analytics dashboard with Framer Motion & Tailwind
│   └── docs         # Comprehensive developer documentation (Mintlify)
├── packages
│   ├── sdk          # @throttlr/sdk - Dual CJS/ESM package published to npm
│   ├── db           # Prisma DB schema & PostgreSQL client layer
│   ├── types        # Shared typescript definitions across apps and packages
│   └── tsconfig     # Global shared TypeScript configurations
```

---

## ⚡ Tech Stack

* **Build Orchestration:** [Turborepo](https://turbo.build/)
* **Package Management:** [pnpm](https://pnpm.io/)
* **Backend Framework:** [Express.js](https://expressjs.com/) with TypeScript
* **Frontend Web App:** [Next.js](https://nextjs.org/) (React 19, Tailwind CSS, Framer Motion)
* **Database & Caching:** [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/) & [Redis](https://redis.io/)
* **SDK Compiler:** [tsup](https://tsup.egoist.dev/) (outputs natively to CJS, ESM, and DTS)
* **Documentation:** [Mintlify](https://mintlify.com/)

---

## 📦 SDK Installation & Usage

The SDK (`@throttlr/sdk`) is compiled to support both ES Modules (`.mjs`) and CommonJS (`.js`) out-of-the-box.

### 1. Installation

```bash
pnpm add @throttlr/sdk
# or
npm install @throttlr/sdk
```

### 2. Basic Usage (Express.js Middleware)

```typescript
import express from "express";
import { RateLimiter, rateLimiterMiddleware } from "@throttlr/sdk";

const app = express();

// 1. Initialize the rate limiter client
const limiter = new RateLimiter({
  apiKey: "your_throttlr_api_key_here",
  baseUrl: "http://localhost:3001/sdk" // Defaults to production API
});

// 2. Protect route with middleware
app.get(
  "/api/sensitive-data",
  rateLimiterMiddleware({
    limiter,
    rule: "sensitive-data-limit", // Configured rule name on your dashboard
    identifierFn: (req) => req.ip || "anonymous", // Custom identifier logic (optional)
  }),
  (req, res) => {
    res.json({ message: "Successfully accessed protected resource!" });
  }
);

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

## 🚀 Quick Start / Development Setup

Follow these steps to run Throttlr locally on your computer:

### 1. Clone & Install Dependencies

Ensure you have [pnpm](https://pnpm.io/) installed.

```bash
# Clone the repository
git clone https://github.com/JejurkarYash/ratelimiter-microservice.git
cd ratelimiter-microservice

# Install workspace dependencies
pnpm install
```

### 2. Start PostgreSQL & Redis

Use the provided docker-compose configuration to set up PostgreSQL and Redis instances instantly:

```bash
docker compose up -d
```

### 3. Set Up Database Migrations

Navigate to the database package, generate the Prisma Client, and push the schema to PostgreSQL:

```bash
cd packages/db
pnpm db:migrate    # or pnpm prisma db push
```

### 4. Run Development Servers

Run the Turborepo development pipeline from the root directory. This runs the `api`, `dashboard`, and `docs` applications concurrently:

```bash
# From the root directory
pnpm dev
```

* **Dashboard:** [http://localhost:3000](http://localhost:3000)
* **API Service:** [http://localhost:3001](http://localhost:3001)
* **Documentation:** [http://localhost:3002](http://localhost:3002)

---

## 🛡️ Key Features

* **High-Throughput Caching:** Employs Redis memory structures to compute sliding-window/fixed-window checks in milliseconds.
* **Dual CJS & ESM Compatibility:** Native imports and compiles cleanly for Node environment and modern web bundlers.
* **Beautiful Insights & Dashboard:** Real-time chart visualization of rules hit rate, allowed requests, and 429 statuses.
* **Developer First docs:** Complete, interactive guides and code snippets for fast integration.
* **Granular Key & Rule Management:** Create, delete, and modify rules instantly without redeploying code.
