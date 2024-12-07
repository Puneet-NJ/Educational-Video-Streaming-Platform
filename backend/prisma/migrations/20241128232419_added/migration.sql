/*
  Warnings:

  - Added the required column `isUserActive` to the `UserInRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserInRoom" ADD COLUMN     "isUserActive" BOOLEAN NOT NULL;
