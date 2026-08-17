-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;
