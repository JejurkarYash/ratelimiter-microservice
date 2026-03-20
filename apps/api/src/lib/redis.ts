import redis from "ioredis";
import { config } from "dotenv";

config();

export const redisClient = new redis(
  process.env.REDIS_URL || "redis://localhost:6379",
);

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default redisClient;
