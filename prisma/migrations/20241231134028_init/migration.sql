-- AlterTable
ALTER TABLE "Exam" ALTER COLUMN "startTime" SET DATA TYPE TEXT,
ALTER COLUMN "endTime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "phone" DROP NOT NULL;