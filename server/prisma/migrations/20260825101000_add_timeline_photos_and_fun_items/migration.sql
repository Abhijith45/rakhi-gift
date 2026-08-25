-- AlterTable
ALTER TABLE "GiftMemory" ADD COLUMN IF NOT EXISTS "photoId" TEXT,
ADD COLUMN IF NOT EXISTS "imageUrl" TEXT,
ADD COLUMN IF NOT EXISTS "thumbnailUrl" TEXT,
ADD COLUMN IF NOT EXISTS "cloudinaryPublicId" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "GiftFunItem" (
    "id" TEXT NOT NULL,
    "giftId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GiftFunItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "GiftMemory_photoId_idx" ON "GiftMemory"("photoId");
CREATE INDEX IF NOT EXISTS "GiftFunItem_giftId_idx" ON "GiftFunItem"("giftId");
CREATE INDEX IF NOT EXISTS "GiftFunItem_displayOrder_idx" ON "GiftFunItem"("displayOrder");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'GiftMemory_photoId_fkey'
    ) THEN
        ALTER TABLE "GiftMemory" ADD CONSTRAINT "GiftMemory_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "GiftPhoto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'GiftFunItem_giftId_fkey'
    ) THEN
        ALTER TABLE "GiftFunItem" ADD CONSTRAINT "GiftFunItem_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gift"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
