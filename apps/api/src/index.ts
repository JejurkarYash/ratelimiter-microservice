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

// Initialize Redis Client
import "./lib/redis.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoute);
app.use("/tenant", jwtMiddleware, tenantRoute);
app.use("/rules", jwtMiddleware, rulesRoute);
app.use("/sdk", ipRateLimiting, apiKeyMiddleware, sdkRoute);

const port = process.env.PORT || 3000;

// Health check endpoint
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

