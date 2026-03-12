/*
  Warnings:

  - You are about to drop the column `frequency` on the `Habit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "frequency",
ADD COLUMN     "days" TEXT NOT NULL DEFAULT '0,1,2,3,4,5,6',
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "Frequency";
