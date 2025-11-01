-- CreateEnum
CREATE TYPE "CycleType" AS ENUM ('DAILY', 'MONTHLY', 'CUSTOM');

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN "cycle_type" "CycleType" NOT NULL DEFAULT 'MONTHLY',
ADD COLUMN "cycle_days" INTEGER;

-- CreateIndex
CREATE INDEX "subscriptions_end_date_idx" ON "subscriptions"("end_date");
