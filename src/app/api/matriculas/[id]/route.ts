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

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await request.json();

        const matricula = await prisma.enrollment.update({
            where: { id: id },
            data: {
                trainingGroupId: data.trainingGroupId,
                studentId: data.studentId,
                scheduleId: data.scheduleId,
                // Atualiza a data apenas se ela for explicitamente enviada na requisição
                ...(data.enrollmentDate && { enrollmentDate: new Date(data.enrollmentDate) }),
            },
        });

        return NextResponse.json(matricula);
    } catch (error) {
        console.error('Erro ao atualizar matrícula:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar matrícula' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.enrollment.delete({
            where: { id: id },
        });

        return NextResponse.json({ message: 'Matrícula removida com sucesso' });
    } catch (error) {
        console.error('Erro ao remover matrícula:', error);
        return NextResponse.json(
            { error: 'Erro ao remover matrícula' },
            { status: 500 }
        );
    }
}