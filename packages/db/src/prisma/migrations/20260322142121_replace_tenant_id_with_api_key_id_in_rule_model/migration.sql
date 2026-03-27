/*
  Warnings:

  - A unique constraint covering the columns `[apiKeyId,name]` on the table `Rule` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Rule_tenantId_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Rule_apiKeyId_name_key" ON "Rule"("apiKeyId", "name");
