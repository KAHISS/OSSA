/*
  Warnings:

  - You are about to drop the column `commisionPerStudent` on the `instructor` table. All the data in the column will be lost.
  - Added the required column `commissionPerStudent` to the `instructor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "instructor" DROP COLUMN "commisionPerStudent",
ADD COLUMN     "commissionPerStudent" DECIMAL(6,2) NOT NULL;
