/**
 * Rota para GET e POST de registrations (inscrição de aluno em um Plano)
 * GET  -> lista todas as inscrições
 *         Aceita ?studentId=xxx para filtrar por aluno (usado pelo cadastro de matrícula)
 * POST -> cria uma nova inscrição de um aluno em um plano
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateDueDate } from '@/utils/registration-utils';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const studentId = searchParams.get('studentId');

  const registrations = await prisma.registration.findMany({
    where: {
      // Quando studentId é informado, filtra apenas as inscrições daquele aluno
      ...(studentId ? { studentId } : {}),
    },
    include: {
      student: true,
      plan: true,
    },
  });

  return NextResponse.json(registrations);
}

export async function POST(request: NextRequest) {
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
        error: 'Erro ao criar inscrição no plano',
        details: String(error),
      },
      { status: 500 }
    );
  }
}
