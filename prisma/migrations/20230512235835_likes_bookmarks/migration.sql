-- CreateTable
CREATE TABLE "UserLikeOnLearningSet" (
    "userId" STRING NOT NULL,
    "learningSetId" STRING NOT NULL,

    CONSTRAINT "UserLikeOnLearningSet_pkey" PRIMARY KEY ("userId","learningSetId")
);

-- CreateTable
CREATE TABLE "UserBookmarkOnLearningSet" (
    "userId" STRING NOT NULL,
    "learningSetId" STRING NOT NULL,

    CONSTRAINT "UserBookmarkOnLearningSet_pkey" PRIMARY KEY ("userId","learningSetId")
);

-- AddForeignKey
ALTER TABLE "UserLikeOnLearningSet" ADD CONSTRAINT "UserLikeOnLearningSet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLikeOnLearningSet" ADD CONSTRAINT "UserLikeOnLearningSet_learningSetId_fkey" FOREIGN KEY ("learningSetId") REFERENCES "LearningSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBookmarkOnLearningSet" ADD CONSTRAINT "UserBookmarkOnLearningSet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBookmarkOnLearningSet" ADD CONSTRAINT "UserBookmarkOnLearningSet_learningSetId_fkey" FOREIGN KEY ("learningSetId") REFERENCES "LearningSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
