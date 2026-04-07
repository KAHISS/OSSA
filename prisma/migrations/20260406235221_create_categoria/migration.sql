-- CreateTable
CREATE TABLE "Categoria" (
    "id_categoria" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" VARCHAR(1255),
    "faixa_etaria" VARCHAR(30) NOT NULL,
    "faixa_peso" VARCHAR(30) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id_categoria")
);
