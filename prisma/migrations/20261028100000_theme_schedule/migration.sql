-- CreateTable
CREATE TABLE "ThemeSchedule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "theme" INTEGER NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ThemeSchedule_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE INDEX "ThemeSchedule_startsAt_endsAt_idx" ON "ThemeSchedule"("startsAt", "endsAt");