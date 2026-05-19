/*
  Warnings:

  - Added the required column `birth_date` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergency_phone` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Student', 'Instructor', 'Admin');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "birth_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "emergency_phone" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "type" "UserType" NOT NULL,
ADD COLUMN     "weight" DECIMAL(65,30) NOT NULL;
