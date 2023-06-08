-- CreateTable
CREATE TABLE "FeatureOnLearningSet" (
    "learningSetId" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeatureOnLearningSet_pkey" PRIMARY KEY ("learningSetId")
);

-- AddForeignKey
ALTER TABLE "FeatureOnLearningSet" ADD CONSTRAINT "FeatureOnLearningSet_learningSetId_fkey" FOREIGN KEY ("learningSetId") REFERENCES "LearningSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
