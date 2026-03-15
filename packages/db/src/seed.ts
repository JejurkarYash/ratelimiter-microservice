import { prisma } from "./prisma.js";
import bcrypt from "bcrypt";
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

  // Create a test rule
  const rule = await prisma.rule.create({
    data: {
      name: "Rate Limit Rule",
      limit: 100,
      window: 3600,
      algorithm: "FIXED_WINDOW",
      tenantId: tenant.id,
    },
  });

  console.log("✅ Created rule:", rule.id);

  console.log("🌱 Seed completed!");
}

seed().catch((e) => {
  console.error("Error seeding the database:", e);
});
