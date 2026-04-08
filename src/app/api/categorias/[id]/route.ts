/*
 * Rota para GET, PUT e DELETE de categorias
 * GET -> lista categoria
 * PUT -> atualiza categoria
 * DELETE -> remove categoria
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/categorias/:id -> busca por ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const categoria = await prisma.categoria.findUnique({
    where: { id_categoria: Number(params.id) },
  });

  if (!categoria) {
    return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
  }

  return NextResponse.json(categoria);
}

// PUT /api/categorias/:id -> atualiza
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { nome, descricao, faixa_etaria, faixa_peso } = body;

    const categoria = await prisma.categoria.update({
      where: { id_categoria: Number(params.id) },
      data: { nome, descricao, faixa_etaria, faixa_peso },
    });

    return NextResponse.json(categoria);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar categoria' },
      { status: 500 }
    );
  }
}

// DELETE /api/categorias/:id -> remove
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.categoria.delete({
      where: { id_categoria: Number(params.id) },
    });

    return NextResponse.json({ message: 'Categoria removida com sucesso' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao remover categoria' },
      { status: 500 }
    );
  }
}
