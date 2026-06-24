/**
 * Rota para GET e POST de registrations (matrícula de aluno em um Plano)
 * GET  -> lista todas as matrículas em planos
 * POST -> cria uma nova matrícula de um aluno em um plano
 *
 * A data de vencimento (dueDate) é calculada automaticamente a partir da
 * data de hoje + duração (period) do plano, a menos que seja explicitamente
 * informada no corpo da requisição.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateDueDate } from '@/utils/registration-utils';

// GET -> lista registrations
export async function GET() {
  const registrations = await prisma.registration.findMany({
    include: {
      student: true,
      plan: true,
    },
  });
  return NextResponse.json(registrations);
}

// POST -> cria registration
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.studentId || !data.planId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    const plan = await prisma.plan.findUnique({ where: { id: data.planId } });

    if (!plan) {
      return NextResponse.json(
        { error: 'Plano não encontrado' },
        { status: 404 }
      );
    }

    const startDate = data.startDate ? new Date(data.startDate) : new Date();
    const dueDate = data.dueDate ? new Date(data.dueDate) : calculateDueDate(plan.period, startDate);

    const registration = await prisma.registration.create({
      data: {
        studentId: data.studentId,
        planId: data.planId,
        startDate,
        dueDate,
        status: data.status ?? 'ACTIVE',
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Erro ao criar matrícula no plano',
        details: String(error),
      },
      { status: 500 }
    );
  }
}
