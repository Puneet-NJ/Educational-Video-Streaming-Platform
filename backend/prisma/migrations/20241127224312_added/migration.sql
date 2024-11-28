/*
  Warnings:

  - A unique constraint covering the columns `[teacherId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teacherId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "teacherId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "RoomPermissions" (
    "id" TEXT NOT NULL,
    "canPublish" BOOLEAN NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "RoomPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomPermissions_roomId_key" ON "RoomPermissions"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_teacherId_key" ON "Room"("teacherId");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomPermissions" ADD CONSTRAINT "RoomPermissions_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
