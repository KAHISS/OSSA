/*
 * Rota para GET, PUT e DELETE de uma registration específica
 * GET    -> busca a matrícula no plano por ID
 * PUT    -> atualiza a matrícula no plano
 * DELETE -> remove a matrícula no plano
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const registration = await prisma.registration.findUnique({
        where: { id: id },
        include: {
            student: true,
            plan: true,
        },
    });

    if (!registration) {
        return NextResponse.json({ error: 'Matrícula no plano não encontrada' }, { status: 404 });
    }

    return NextResponse.json(registration);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await request.json();

        const registration = await prisma.registration.update({
            where: { id: id },
            data: {
                studentId: data.studentId,
                planId: data.planId,
                status: data.status,
                // Atualiza a data apenas se ela for explicitamente enviada na requisição
                ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
                ...(data.startDate && { startDate: new Date(data.startDate) }),
            },
        });

        return NextResponse.json(registration);
    } catch (error) {
        console.error('Erro ao atualizar matrícula no plano:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar matrícula no plano' },
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

        await prisma.registration.delete({
            where: { id: id },
        });

        return NextResponse.json({ message: 'Matrícula no plano removida com sucesso' });
    } catch (error) {
        console.error('Erro ao remover matrícula no plano:', error);
        return NextResponse.json(
            { error: 'Erro ao remover matrícula no plano' },
            { status: 500 }
        );
    }
}
