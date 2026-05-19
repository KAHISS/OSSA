import {NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/*
 * GET -> busca por ID
 * PUT -> atualiza plano
 * DELETE -> remove plano
 */

// GET /api/plano/:id -> busca por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const plano = await prisma.plan.findUnique({
    where: { id: id },
  });

  if (!plano) {
    return NextResponse.json({ error: 'Plano não encontrado' }, { status: 404 });
  }

  return NextResponse.json(plano);
}
 
// PUT /api/plano/:id -> atualiza
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const plano = await prisma.plan.update({
      where: { id: id },
      data: {
        name: data.name,
        price: data.price,
        description: data.description,
      },
    });

    return NextResponse.json(plano);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar plano' },
      { status: 500 }
    );
  }
}