import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { User, Prisma } from '@generated/prisma/client';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { id: id },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Erro interno ao buscar usuário:", error);
        return NextResponse.json(
            { error: 'Erro interno no servidor' },
            { status: 500 }
        );
    }
}
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const data = await request.json();
        const { id } = await params;

        if (data.type === 'Student') {
            await prisma.instructor.deleteMany({ where: { id: id } });
        }
        else if (data.type === 'Instructor') {
            await prisma.student.deleteMany({ where: { id: id } });
        }
        else {
            await prisma.student.deleteMany({ where: { id: id } });
            await prisma.instructor.deleteMany({ where: { id: id } });
        }

        const updateData: Prisma.UserUpdateInput = {
            name: data.name,
            last_name: data.last_name,
            email: data.email,
            sex: data.sex,
            birth_date: data.birth_date ? new Date(data.birth_date) : undefined,
            password: data.password,
            phone: data.phone,
            emergency_phone: data.emergency_phone,
            weight: data.weight,
            type: data.type,
        };

        if (data.type === 'Student') {
            updateData.student = {
                upsert: {
                    create: {
                        belt: data.belt ?? 'WHITE',
                        stripe: data.stripe ?? 0
                    },
                    update: {
                        belt: data.belt,
                        stripe: data.stripe
                    }
                }
            };
        } else if (data.type === 'Instructor') {
            updateData.instructor = {
                upsert: {
                    create: {
                        belt: data.belt ?? 'WHITE',
                        stripe: data.stripe ?? 0,
                        commissionPerStudent: data.commissionPerStudent ?? 0
                    },
                    update: {
                        belt: data.belt,
                        stripe: data.stripe,
                        commissionPerStudent: data.commissionPerStudent
                    }
                }
            };
        }

        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: updateData,
            include: {
                student: true,
                instructor: true
            }
        });

        return NextResponse.json(updatedUser, { status: 200 });

    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        return NextResponse.json({ error: "Falha ao atualizar usuário", details: error }, { status: 500 });
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