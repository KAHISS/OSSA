import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/*
 * GET -> busca por ID
 * PUT -> atualiza publicação
 * DELETE -> remove publicação
 */

// GET /api/publicacoes/:id -> busca por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const publicacao = await prisma.publication.findUnique({
      where: { id: id },
    });

    if (!publicacao) {
      return NextResponse.json(
        { error: 'Publicação não encontrada' },
        { status: 404 }
      );
    }
    return NextResponse.json(publicacao);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar publicação: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT /api/publicacoes/:id -> atualiza
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Ajustado para refletir as colunas exatas do seu schema.prisma
    const publicacao = await prisma.publication.update({
      where: { id: id },
      data: {
        title: data.title,
        content: data.content,
        name: data.authorId, // 🧠 CORREÇÃO: O seu schema usa 'name' para o ID do autor
      },
    });

    return NextResponse.json(publicacao);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar publicação: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE /api/publicacoes/:id -> remove
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.publication.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Publicação deletada com sucesso' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao deletar publicação: ' + (error as Error).message },
      { status: 500 }
    );
  }
}