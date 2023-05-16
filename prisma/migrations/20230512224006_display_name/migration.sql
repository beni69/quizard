/*
  Warnings:

  - You are about to drop the column `name` on the `auth_user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `auth_user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `displayName` to the `auth_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `auth_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "auth_user_name_key";

-- AlterTable
ALTER TABLE "auth_user" DROP COLUMN "name";
ALTER TABLE "auth_user" ADD COLUMN     "displayName" STRING NOT NULL;
ALTER TABLE "auth_user" ADD COLUMN     "username" STRING NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_username_key" ON "auth_user"("username");
