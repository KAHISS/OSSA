/*
 * Rota para GET, PUT e DELETE de matrículas
 * GET -> busca matrícula por ID
 * PUT -> atualiza matrícula
 * DELETE -> remove matrícula
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const { id } = await params;
  
    const matricula = await prisma.enrollment.findUnique({
      where: { id: id },
      include: {
        trainingGroup: true,
        student: true,
        schedule: true,
      },
    });
  
    if (!matricula) {
      return NextResponse.json({ error: 'Matrícula não encontrada' }, { status: 404 });
    }
  
    return NextResponse.json(matricula);
}