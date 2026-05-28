import { Redis } from "ioredis";
import { config } from "dotenv";

config();

export const redisClient = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379",
);

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err: any) => {
  console.error("Redis connection error:", err);
});

export default redisClient;
