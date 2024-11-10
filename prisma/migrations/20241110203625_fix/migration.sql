/*
  Warnings:

  - A unique constraint covering the columns `[unsubscribe_token]` on the table `emails` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "emails" ADD COLUMN     "unsubscribe_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "emails_unsubscribe_token_key" ON "emails"("unsubscribe_token");
