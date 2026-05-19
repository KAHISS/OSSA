/*
  Warnings:

  - You are about to drop the column `createdAt` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `category` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- AlterTable
ALTER TABLE "category" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "plan" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "period" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(6,2) NOT NULL,

    CONSTRAINT "plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch" (
    "id" TEXT NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "neighborhood" VARCHAR(255) NOT NULL,
    "number" INTEGER NOT NULL,
    "CEP" VARCHAR(8) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_group" (
    "id" TEXT NOT NULL,
    "student_count" SMALLINT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "instructor_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule" (
    "id" TEXT NOT NULL,
    "training_group_id" TEXT NOT NULL,
    "day_of_week" "DayOfWeek" NOT NULL,
    "startTime" TIME NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollment" (
    "id" TEXT NOT NULL,
    "enrollment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "training_group_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,

    CONSTRAINT "enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "training_group_branch_id_idx" ON "training_group"("branch_id");

-- CreateIndex
CREATE INDEX "training_group_instructor_id_idx" ON "training_group"("instructor_id");

-- CreateIndex
CREATE INDEX "schedule_training_group_id_idx" ON "schedule"("training_group_id");

-- CreateIndex
CREATE INDEX "enrollment_training_group_id_idx" ON "enrollment"("training_group_id");

-- CreateIndex
CREATE INDEX "enrollment_student_id_idx" ON "enrollment"("student_id");

-- CreateIndex
CREATE INDEX "enrollment_schedule_id_idx" ON "enrollment"("schedule_id");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_student_id_training_group_id_schedule_id_key" ON "enrollment"("student_id", "training_group_id", "schedule_id");

-- AddForeignKey
ALTER TABLE "training_group" ADD CONSTRAINT "training_group_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_group" ADD CONSTRAINT "training_group_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_training_group_id_fkey" FOREIGN KEY ("training_group_id") REFERENCES "training_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_training_group_id_fkey" FOREIGN KEY ("training_group_id") REFERENCES "training_group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
