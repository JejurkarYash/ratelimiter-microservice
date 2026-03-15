/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Rule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId]` on the table `Rule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rule_name_key" ON "Rule"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Rule_tenantId_key" ON "Rule"("tenantId");
