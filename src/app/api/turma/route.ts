/**
 * Rota para GET e POST de turmas (Training Groups)
 * GET -> lista turmas
 * POST -> cria turma   
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET -> lista turmas
export async function GET() {
  try {
    const trainingGroups = await prisma.trainingGroup.findMany({
      include: {
        branch: true,
        instructor: true,
        schedules: true,
        enrollments: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(trainingGroups);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao listar turmas' },
      { status: 500 }
    );
  }
}

// POST -> cria turma
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.studentCapacity || !data.instructorId || !data.name) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando: studentCapacity, instructorId, name' },
        { status: 400 }
      );
    }

    if (data.studentCapacity <= 0) {
      return NextResponse.json(
        { error: 'A capacidade de alunos deve ser maior que 0' },
        { status: 400 }
      );
    }

    // Verifica se o instrutor existe e é do tipo Instructor
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

  const trainingGroup = await prisma.trainingGroup.create({
    data: {
      name: data.name,
      studentCapacity: Number(data.studentCapacity),
      instructorId: data.instructorId,
      ...(data.branchId && { branchId: data.branchId })
    }
  });

    return NextResponse.json(trainingGroup, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar turma:", error);
    return NextResponse.json(
      { error: 'Erro ao criar turma' },
      { status: 500 }
    );
  }
}

// 1. PUT -> Atualizar uma turma existente
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Verifica se a turma existe antes de atualizar
    const existingGroup = await prisma.trainingGroup.findUnique({
      where: { id },
    });

    if (!existingGroup) {
      return NextResponse.json(
        { error: 'Turma não encontrada' },
        { status: 404 }
      );
    }

    // Se o instrutor for alterado, valida se ele existe e é instrutor
    if (data.instructorId && data.instructorId !== existingGroup.instructorId) {
      const instructor = await prisma.user.findUnique({
        where: { id: data.instructorId },
        include: { instructor: true }
      });

      if (!instructor || !instructor.instructor) {
        return NextResponse.json(
          { error: 'O novo usuário selecionado não é um instrutor válido' },
          { status: 400 }
        );
      }
    }

    // Valida capacidade se enviada
    if (data.studentCapacity !== undefined && data.studentCapacity <= 0) {
      return NextResponse.json(
        { error: 'A capacidade de alunos deve ser maior que 0' },
        { status: 400 }
      );
    }

    // Executa a atualização no banco de dados
    const updatedGroup = await prisma.trainingGroup.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.studentCapacity !== undefined && { studentCapacity: Number(data.studentCapacity) }),
        ...(data.instructorId && { instructorId: data.instructorId }),
        ...(data.branchId !== undefined && { branchId: data.branchId || null }), // permite remover a filial enviando null
      },
    });

    return NextResponse.json(updatedGroup, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar turma:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar turma' },
      { status: 500 }
    );
  }
}

// 2. DELETE -> Deletar uma turma
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Verifica se a turma existe
    const existingGroup = await prisma.trainingGroup.findUnique({
      where: { id },
    });

    if (!existingGroup) {
      return NextResponse.json(
        { error: 'Turma não encontrada' },
        { status: 404 }
      );
    }

    // Deleta do banco de dados
    await prisma.trainingGroup.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Turma deletada com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao deletar turma:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar turma' },
      { status: 500 }
    );
  }
}
