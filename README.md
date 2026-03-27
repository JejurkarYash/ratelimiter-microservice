# Rate Limiter

A modern rate-limiting service built as a monorepo using Turborepo. Provides multiple algorithms (Fixed Window, Sliding Window) for rate limiting with persistent storage and real-time SDK integration.

**Status:** 🚧 Under Development

## Project Structure

- **`apps/api`** - Express.js backend server for rate limiting rules management
- **`apps/dashboard`** - Dashboard for managing rate limiting rules
- **`packages/db`** - Prisma database layer with PostgreSQL
- **`packages/sdk`** - JavaScript SDK for client-side rate limiting
- **`packages/types`** - Shared TypeScript type definitions

## Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL + Prisma ORM
- **Cache:** Redis
- **Monorepo:** Turborepo
- **Package Manager:** pnpm

## Quick Start

```sh
# Install dependencies
pnpm install

# Setup database
cd packages/db
pnpm db:migrate

# Start development
cd ../../apps/api
pnpm dev
```

## Features (Planned)

- Multiple rate limiting algorithms
- API key-based authentication
- Tenant isolation
- Real-time rule management
- SDK for easy integration
  yarn dlx turbo build
  pnpm exec turbo build
