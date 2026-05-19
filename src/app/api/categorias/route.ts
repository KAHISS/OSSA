/**
 * Rota para GET e POST de categorias
 * GET -> lista categorias
 * POST -> cria categoria   
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET -> lista categorias
export async function GET() {
  const categorias = await prisma.category.findMany();
  return NextResponse.json(categorias);
}

// POST -> cria categoria
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.name || !data.age_group || !data.weight_range) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    const categoria = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        age_group: data.age_group,
        weight_range: data.weight_range,
      },
    })

    return NextResponse.json(categoria, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar categoria' + error },
      { status: 500 }
    );
  }
}
