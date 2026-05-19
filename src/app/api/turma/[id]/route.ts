/*
 * Rota para GET, PUT e DELETE de turmas (Training Groups)
 * GET -> busca turma por ID
 * PUT -> atualiza turma
 * DELETE -> remove turma
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/turma/:id -> busca por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const trainingGroup = await prisma.trainingGroup.findUnique({
      where: { id },
      include: {
        branch: true,
        instructor: true,
        schedules: {
          include: {
            enrollments: true
          }
        },
        enrollments: true
      }
    });

    if (!trainingGroup) {
      return NextResponse.json(
        { error: 'Turma não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(trainingGroup);
  } catch (error) {
    console.error("Erro ao buscar turma:", error);
    return NextResponse.json(
      { error: 'Erro ao buscar turma' },
      { status: 500 }
    );
  }
}

// PUT /api/turma/:id -> atualiza
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Verifica se a turma existe
    const trainingGroup = await prisma.trainingGroup.findUnique({
      where: { id }
    });

    if (!trainingGroup) {
      return NextResponse.json(
        { error: 'Turma não encontrada' },
        { status: 404 }
      );
    }

    // Validações
    if (data.studentCapacity !== undefined && data.studentCapacity <= 0) {
      return NextResponse.json(
        { error: 'A capacidade de alunos deve ser maior que 0' },
        { status: 400 }
      );
    }

    // Verifica se a branch existe (se foi informada)
    if (data.branchId) {
      const branch = await prisma.branch.findUnique({
        where: { id: data.branchId }
      });

      if (!branch) {
        return NextResponse.json(
          { error: 'Filial não encontrada' },
          { status: 404 }
        );
      }
    }

    // Verifica se o instrutor existe e é do tipo Instructor (se foi informado)
    if (data.instructorId) {
      const instructor = await prisma.user.findUnique({
        where: { id: data.instructorId },
        include: { instructor: true }
      });

      if (!instructor) {
        return NextResponse.json(
          { error: 'Instrutor não encontrado' },
          { status: 404 }
        );
      }

      if (!instructor.instructor) {
        return NextResponse.json(
          { error: 'O usuário selecionado não é um instrutor' },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.trainingGroup.update({
      where: { id },
      data: {
        ...(data.studentCapacity !== undefined && { studentCapacity: data.studentCapacity }),
        ...(data.branchId && { branchId: data.branchId }),
        ...(data.instructorId && { instructorId: data.instructorId })
      },
      include: {
        branch: true,
        instructor: true
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar turma:", error);
    return NextResponse.json(
      { error: 'Erro ao atualizar turma' },
      { status: 500 }
    );
  }
}

// DELETE /api/turma/:id -> remove
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const trainingGroup = await prisma.trainingGroup.findUnique({
      where: { id }
    });

    if (!trainingGroup) {
      return NextResponse.json(
        { error: 'Turma não encontrada' },
        { status: 404 }
      );
    }

    // Verifica se há matrículas ativas
    const enrollments = await prisma.enrollment.findMany({
      where: { trainingGroupId: id }
    });

    if (enrollments.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível deletar uma turma com matrículas ativas' },
        { status: 400 }
      );
    }

    await prisma.trainingGroup.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Turma deletada com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao deletar turma:", error);
    return NextResponse.json(
      { error: 'Erro ao deletar turma' },
      { status: 500 }
    );
  }
}
