-- AlterTable
ALTER TABLE "Gift" ALTER COLUMN "slug" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "webhookEventId" TEXT,
ADD COLUMN     "webhookReceivedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Payment_webhookEventId_idx" ON "Payment"("webhookEventId");
