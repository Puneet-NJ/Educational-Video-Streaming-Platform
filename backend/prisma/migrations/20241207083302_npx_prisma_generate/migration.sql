/*
  Warnings:

  - You are about to drop the column `isUserActive` on the `UserInRoom` table. All the data in the column will be lost.
  - You are about to drop the column `joinedAt` on the `UserInRoom` table. All the data in the column will be lost.
  - You are about to drop the `RoomPermissions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `isPartOfRoom` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RoomPermissions" DROP CONSTRAINT "RoomPermissions_roomId_fkey";

-- DropIndex
DROP INDEX "Room_teacherId_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isPartOfRoom" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "UserInRoom" DROP COLUMN "isUserActive",
DROP COLUMN "joinedAt",
ADD COLUMN     "joindedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "RoomPermissions";
