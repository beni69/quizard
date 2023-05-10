/*
  Warnings:

  - Added the required column `description` to the `LearningSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `LearningSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visibility` to the `LearningSet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'UNLISTED', 'PRIVATE');

-- AlterTable
ALTER TABLE "LearningSet" ADD COLUMN     "description" STRING NOT NULL;
ALTER TABLE "LearningSet" ADD COLUMN     "name" STRING NOT NULL;
ALTER TABLE "LearningSet" ADD COLUMN     "visibility" "Visibility" NOT NULL;
