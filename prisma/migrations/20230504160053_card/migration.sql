-- CreateTable
CREATE TABLE "Card" (
    "id" STRING NOT NULL,
    "term" STRING NOT NULL,
    "definition" STRING NOT NULL,
    "learningSetId" STRING NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_learningSetId_fkey" FOREIGN KEY ("learningSetId") REFERENCES "LearningSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
