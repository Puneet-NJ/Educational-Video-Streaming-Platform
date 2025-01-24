/*
  Warnings:

  - You are about to drop the column `isPartOfRoom` on the `User` table. All the data in the column will be lost.
  - Added the required column `isPartOfRoom` to the `UserInRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isPartOfRoom";

-- AlterTable
ALTER TABLE "UserInRoom" ADD COLUMN     "isPartOfRoom" BOOLEAN NOT NULL;
