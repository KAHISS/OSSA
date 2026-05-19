/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Instructor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Instructor" DROP CONSTRAINT "Instructor_id_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_id_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Instructor";

-- DropTable
DROP TABLE "Student";

-- CreateTable
CREATE TABLE "student" (
    "id" TEXT NOT NULL,
    "belt" "Belt" NOT NULL,
    "stripe" INTEGER NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instructor" (
    "id" TEXT NOT NULL,
    "belt" "Belt" NOT NULL,
    "stripe" INTEGER NOT NULL,
    "commisionPerStudent" DECIMAL(6,2) NOT NULL,

    CONSTRAINT "instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id_categoria" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" VARCHAR(1255),
    "faixa_etaria" VARCHAR(30) NOT NULL,
    "faixa_peso" VARCHAR(30) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id_categoria")
);

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor" ADD CONSTRAINT "instructor_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
