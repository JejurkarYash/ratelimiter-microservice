/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,name]` on the table `ApiKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apiKeyId` to the `Rule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rule" ADD COLUMN     "apiKeyId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_tenantId_name_key" ON "ApiKey"("tenantId", "name");

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
