-- CreateTable
CREATE TABLE "UserReportOnLearningSet" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inapropriate" BOOL NOT NULL,
    "privacy" BOOL NOT NULL,
    "spam" BOOL NOT NULL,
    "misleading" BOOL NOT NULL,
    "copyright" BOOL NOT NULL,
    "customReason" STRING,
    "learningSetId" STRING NOT NULL,
    "reporterId" STRING NOT NULL,

    CONSTRAINT "UserReportOnLearningSet_pkey" PRIMARY KEY ("learningSetId","reporterId")
);

-- AddForeignKey
ALTER TABLE "UserReportOnLearningSet" ADD CONSTRAINT "UserReportOnLearningSet_learningSetId_fkey" FOREIGN KEY ("learningSetId") REFERENCES "LearningSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReportOnLearningSet" ADD CONSTRAINT "UserReportOnLearningSet_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "auth_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
