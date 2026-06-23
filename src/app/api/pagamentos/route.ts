/**
 * Rota para GET e POST de pagamentos
 * GET  -> lista pagamentos
 * POST -> cria pagamento
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET -> lista pagamentos
export async function GET() {
  const payments = await prisma.payment.findMany({
    include: { student: true },
    orderBy: { dueDate: 'desc' },
  });
  return NextResponse.json(payments);
}

// POST -> cria pagamento
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (
      !data.studentId ||
      !data.type ||
      data.amount === undefined ||
      data.amount === null ||
      !data.dueDate
    ) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    if (Number(data.amount) < 0) {
      return NextResponse.json(
        { error: 'O valor do pagamento não pode ser negativo' },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.create({
      data: {
        studentId: data.studentId,
        type: data.type,
        amount: data.amount,
        dueDate: new Date(data.dueDate),
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : null,
        paymentMethod: data.paymentMethod || null,
        status: data.status || 'PENDING',
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Erro ao criar pagamento',
        details: String(error),
      },
      { status: 500 }
    );
  }
}