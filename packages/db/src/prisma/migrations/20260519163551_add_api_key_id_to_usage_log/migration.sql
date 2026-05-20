-- Delete existing test rows so we can add the NOT NULL column cleanly
DELETE FROM "UsageLog";

-- AlterTable
ALTER TABLE "UsageLog" ADD COLUMN "apiKeyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UsageLog" ADD CONSTRAINT "UsageLog_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
