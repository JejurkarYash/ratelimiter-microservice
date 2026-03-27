import { prisma } from "./prisma.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
async function seed() {
  console.log("🌱 Starting database seed...");

  // Create a test tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: "Test Tenant",
      email: "test@example.com",
      password: await bcrypt.hash("password123", 10),
    },
  });
  console.log("✅ Created tenant:", tenant.id);

  //   generating random api key
  const api = `sk_test_${crypto.randomBytes(32).toString("hex")}`;

  //  hashing api key for storing into db
  const hashKey = crypto.createHash("sha256").update(api).digest("hex");

  const apiKey = await prisma.apiKey.create({
    data: {
      key: hashKey,
      name: "Testing Key",
      tenantId: tenant.id,
    },
  });

  // Create a test rule
  const rule = await prisma.rule.create({
    data: {
      name: "Testing Rule",
      limit: 5,
      window: 60,
      algorithm: "FIXED_WINDOW",
      tenantId: tenant.id,
      apiKeyId: apiKey.id,
    },
  });

  console.log("✅ Created rule:", rule.id);

  console.log("🌱 Seed completed!");
}

seed().catch((e) => {
  console.error("Error seeding the database:", e);
});
