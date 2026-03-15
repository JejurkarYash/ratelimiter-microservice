/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,name]` on the table `Rule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rule_tenantId_name_key" ON "Rule"("tenantId", "name");
