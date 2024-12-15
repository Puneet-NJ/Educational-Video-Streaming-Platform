-- CreateTable
CREATE TABLE "SlidesImage" (
    "id" TEXT NOT NULL,
    "imageKey" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "SlidesImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SlidesImage" ADD CONSTRAINT "SlidesImage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
