/**
 * Rota para GET e POST de categorias
 * GET -> lista categorias
 * POST -> cria categoria   
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET -> lista categorias
export async function GET() {
  const enrollements = await prisma.enrollment.findMany();
  return NextResponse.json(enrollements);
}

// POST -> cria categoria
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (
      !data.trainingGroupId ||
      !data.studentId ||
      !data.scheduleId
    ) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        trainingGroupId: data.trainingGroupId,
        studentId: data.studentId,
        scheduleId: data.scheduleId,
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Erro ao criar matrícula',
        details: String(error),
      },
      { status: 500 }
    );
  }
}