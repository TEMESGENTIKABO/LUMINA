-- AlterTable
ALTER TABLE "PageView" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "PageView_userId_createdAt_idx" ON "PageView"("userId", "createdAt");
