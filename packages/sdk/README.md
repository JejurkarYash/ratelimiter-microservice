# @throttlr/sdk

Official rate-limiting SDK for Throttlr — next-generation, Redis-powered rate limiting as a service.

## Installation

```bash
npm install @throttlr/sdk
# or
pnpm add @throttlr/sdk
# or
yarn add @throttlr/sdk
```

## Usage

### 1. Basic Client Check

Use the client directly to check limits inside any Node.js application:

```typescript
import { RateLimiter } from "@throttlr/sdk";

const limiter = new RateLimiter({
  apiKey: "your-throttlr-api-key",
  // Optional: defaults to the production Throttlr API
  // baseUrl: "https://repoapi-production-fcf8.up.railway.app/sdk" 
});

const result = await limiter.check({
  identifier: "user_12345", // The IP, user ID, or api key you are checking
  rule: "premium-api-calls" // The rule configured in your Throttlr Dashboard
});

if (!result.allowed) {
  console.log("Rate limit exceeded! Retry after:", result.resetAt);
} else {
  console.log(`Allowed. Remaining quota: ${result.remaining}/${result.count}`);
}
```

### 2. Express Middleware

Drop the middleware into your Express application to automatically protect your endpoints:

```typescript
import express from "express";
import { RateLimiter, RateLimiterMiddleware } from "@throttlr/sdk";

const app = express();

const limiter = new RateLimiter({
  apiKey: "your-throttlr-api-key"
});

// Apply rate limiting middleware to a route
app.get("/api/data", RateLimiterMiddleware({
  limiter,
  rule: "public-endpoints",
  // Optional custom identifier (defaults to req.ip)
  identifierFn: (req) => req.headers["x-user-id"] as string || req.ip
}), (req, res) => {
  res.json({ message: "Success!" });
});
```

## Error Handling

The SDK exposes `RateLimiterError` to help you handle connection issues or incorrect configuration:

```typescript
import { RateLimiterError } from "@throttlr/sdk";

try {
  const result = await limiter.check({ identifier, rule });
} catch (err) {
  if (err instanceof RateLimiterError) {
    console.error(`Throttlr Error [${err.code}]: ${err.message}`);
  }
}
```

## License

ISC
