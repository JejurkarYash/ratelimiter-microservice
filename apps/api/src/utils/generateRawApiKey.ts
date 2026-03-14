import crypto from "crypto";

export function generateRawApiKey() {
  const apiKey = crypto.randomBytes(32).toString("hex");
  return `sk_test_${apiKey}`;
}
