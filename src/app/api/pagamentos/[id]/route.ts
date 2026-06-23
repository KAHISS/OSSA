/**
 * Rota para GET, PUT e DELETE de um pagamento específico
 * GET    -> busca um pagamento pelo id
 * PUT    -> atualiza um pagamento
 * DELETE -> remove um pagamento
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

// GET -> busca um pagamento pelo id
export async function GET(request: Request, { params }: Params) {
  const { id } = await params;

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { student: true },
  });

  if (!payment) {
    return NextResponse.json(
      { error: 'Pagamento não encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json(payment);
}

// PUT -> atualiza um pagamento
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const data = await request.json();

    const existingPayment = await prisma.payment.findUnique({ where: { id } });

    if (!existingPayment) {
      return NextResponse.json(
        { error: 'Pagamento não encontrado' },
        { status: 404 }
      );
    }

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

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        studentId: data.studentId,
        type: data.type,
        amount: data.amount,
        dueDate: new Date(data.dueDate),
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : null,
        paymentMethod: data.paymentMethod || null,
        status: data.status || existingPayment.status,
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Erro ao atualizar pagamento',
        details: String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE -> remove um pagamento
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const existingPayment = await prisma.payment.findUnique({ where: { id } });

    if (!existingPayment) {
      return NextResponse.json(
        { error: 'Pagamento não encontrado' },
        { status: 404 }
      );
    }

    await prisma.payment.delete({ where: { id } });

    return NextResponse.json({ message: 'Pagamento excluído com sucesso' });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Erro ao excluir pagamento',
        details: String(error),
      },
      { status: 500 }
    );
  }
}