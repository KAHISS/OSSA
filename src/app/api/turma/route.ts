/**
 * Rota para GET e POST de turmas (Training Groups)
 * GET -> lista turmas
 * POST -> cria turma   
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    if (!data.studentCapacity || !data.branchId || !data.instructorId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando: studentCapacity, branchId, instructorId' },
        { status: 400 }
      );
    }

    if (data.studentCapacity <= 0) {
      return NextResponse.json(
        { error: 'A capacidade de alunos deve ser maior que 0' },
        { status: 400 }
      );
    }

    // Verifica se a branch existe
    const branch = await prisma.branch.findUnique({
      where: { id: data.branchId }
    });

    if (!branch) {
      return NextResponse.json(
        { error: 'Filial não encontrada' },
        { status: 404 }
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
        studentCapacity: data.studentCapacity,
        branchId: data.branchId,
        instructorId: data.instructorId
      },
      include: {
        branch: true,
        instructor: true
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
