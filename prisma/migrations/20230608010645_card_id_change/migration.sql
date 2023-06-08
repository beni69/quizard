/*
  Warnings:

  - You are about to drop the column `id` on the `Card` table. All the data in the column will be lost.

*/
-- RedefineTables
CREATE TABLE "_prisma_new_Card" (
    "term" STRING NOT NULL,
    "definition" STRING NOT NULL,
    "learningSetId" STRING NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("learningSetId","term")
);
INSERT INTO "_prisma_new_Card" ("definition","learningSetId","term") SELECT "definition","learningSetId","term" FROM "Card";
DROP TABLE "Card" CASCADE;
ALTER TABLE "_prisma_new_Card" RENAME TO "Card";
ALTER TABLE "Card" ADD CONSTRAINT "Card_learningSetId_fkey" FOREIGN KEY ("learningSetId") REFERENCES "LearningSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
