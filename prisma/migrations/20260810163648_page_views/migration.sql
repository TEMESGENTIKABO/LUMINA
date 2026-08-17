-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "articleSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageView_articleSlug_createdAt_idx" ON "PageView"("articleSlug", "createdAt");
