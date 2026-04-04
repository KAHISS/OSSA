import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const data = await request.json();
        const { id } = await params;

        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: {
                name: data.name,
                last_name: data.last_name,
                email: data.email,
                birth_date: data.birth_date ? new Date(data.birth_date) : undefined,
                password: data.password,
                phone: data.phone,
                emergency_phone: data.emergency_phone,
                weight: data.weight,
                type: data.type,
            },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        return NextResponse.json({ error: "Falha ao atualizar usuário" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.user.delete({
            where: { id: id },
        });

        return NextResponse.json(
            { message: "Usuário removido com sucesso!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        return NextResponse.json({ error: "Falha ao deletar usuário" }, { status: 500 });
    }
}