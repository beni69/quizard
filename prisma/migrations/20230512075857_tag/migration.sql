/*
  Warnings:

  - You are about to drop the column `userId` on the `LearningSet` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `LearningSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `LearningSet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LearningSet" DROP CONSTRAINT "LearningSet_userId_fkey";

-- AlterTable
ALTER TABLE "LearningSet" DROP COLUMN "userId";
ALTER TABLE "LearningSet" ADD COLUMN     "authorId" STRING NOT NULL;
ALTER TABLE "LearningSet" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "LearningSet" ADD COLUMN     "tags" STRING[];
ALTER TABLE "LearningSet" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "LearningSet" ADD CONSTRAINT "LearningSet_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "auth_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
