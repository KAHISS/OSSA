/*
  Warnings:

  - You are about to alter the column `commissionPerStudent` on the `instructor` table. The data in that column could be lost. The data in that column will be cast from `Decimal(6,2)` to `DoublePrecision`.
  - You are about to alter the column `weight` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "instructor" ALTER COLUMN "commissionPerStudent" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "weight" SET DATA TYPE DOUBLE PRECISION;
