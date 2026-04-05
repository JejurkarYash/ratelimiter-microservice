import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import tenantRoute from "./routes/tenantRoutes.js";
import jwtMiddleware from "./middlewares/jwtMiddlware.js";
import { apiKeyMiddleware } from "./middlewares/apiKeyMiddleware.js";
import sdkRoute from "./routes/sdkRoute.js";
import rulesRoute from "./routes/rulesRoute.js";
import { ipRateLimiting } from "./middlewares/ipRateLimiting.js";
import { RateLimiter, CheckResult, RateLimitermiddleware } from "@shanks/sdk";

// Initialize Redis Client
import "./lib/redis.js";
import { error } from "console";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
// Auth Routes
app.use("/auth", authRoute);

// All Tenant realted routes are protected by JWT Middleware
//  all routes are insde the tenatRoute
app.use("/tenant", jwtMiddleware, tenantRoute);
app.use("/rules", jwtMiddleware, rulesRoute);

// SDK Routes
app.use("/sdk", ipRateLimiting, apiKeyMiddleware, sdkRoute);

const port = process.env.PORT || 3000;

// creating instance of Ratelimiter class
const limiter = new RateLimiter({
  apiKey:
    "sk_test_536c114948f0cb1c37398026e81fa4569dc55147f1a3c36ceccbfd499c404e39",
  baseUrl: "http://localhost:3000/sdk",
});

app.get("/test", async (req, res) => {
  try {
    const result: CheckResult = await limiter.check({
      identifier: "user_123",
      rule: "john_sdk",
    });

    if (!result.allowed) {
      return res.status(429).json({
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "To Manay Requests",
        },
      });
    }

    return res.send({
      result,
    });
  } catch (err) {
    if (err instanceof Error) {
      return res.send({
        error: {
          code: (err as any).code ?? "UNKNOW_ERROR",
          name: err.name,
          message: err.message,
          statusCode: (err as any).statusCode,
        },
      });
    }
  }
});

app.post(
  "/test",
  jwtMiddleware,
  RateLimitermiddleware({
    limiter,
    identifierFn: (req) => (req as any).tenantId,
    rule: "john_sdk",
  }),
  (req, res) => {
    return res.json({
      message: "from handler side",
      result: req.rateLimitResult,
    });
  },
);

// health checkup endpoint
app.get("/health", async (req, res) => {
  res.send({
    message: "Server is Running",
    status: "OK",
    statusCode: 200,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
