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
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;

  const categoria = await prisma.category.findUnique({
    where: { id: id },
  });

  if (!categoria) {
    return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
  }

  return NextResponse.json(categoria);
}

// PUT /api/categorias/:id -> atualiza
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const categoria = await prisma.category.update({
      where: { id: id },
      data: {
        name: data.name,
        description: data.description,
        age_group: data.age_group,
        weight_range: data.weight_range,
      },
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.category.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Categoria removida com sucesso' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao remover categoria' },
      { status: 500 }
    );
  }
}
