/**
 * Rota para GET e POST de categorias
 * GET -> lista categorias
 * POST -> cria categoria   
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET -> lista categorias
export async function GET() {
  const categorias = await prisma.categoria.findMany();
  return NextResponse.json(categorias);
}

// POST -> cria categoria
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, descricao, faixa_etaria, faixa_peso } = body;

    if (!nome || !faixa_etaria || !faixa_peso) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    const categoria = await prisma.categoria.create({
      data: { nome, descricao, faixa_etaria, faixa_peso },
    });

    return NextResponse.json(categoria, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar categoria' },
      { status: 500 }
    );
  }
}
