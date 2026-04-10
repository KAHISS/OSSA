import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            include: {
                student: true,   
                instructor: true,
            }
        });
        
        return NextResponse.json(users);
        
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return NextResponse.json({ error: "Falha ao buscar usuários" }, { status: 500 });
    }
}
export async function POST(request: Request) {
    try {
        const data = await request.json();

        const newUser = await prisma.user.create({
            data: {
                name: data.name,
                last_name: data.last_name,
                email: data.email,
                birth_date: new Date(data.birth_date),
                password: data.password,
                phone: data.phone,
                emergency_phone: data.emergency_phone,
                weight: data.weight,
                type: data.type,
                student: data.type === 'Student' ? {
                    create: {
                        belt: data.belt ?? 'WHITE',
                        stripe: data.stripe ?? 0
                    }
                } : undefined,
                instructor: data.type === 'Instructor' ? {
                    create: {
                        belt: data.belt ?? 'WHITE',
                        stripe: data.stripe ?? 0,
                        commisionPerStudent: data.commisionPerStudent ?? 0
                    }
                } : undefined,
            },
            include: {
                student: true,
                instructor: true
            }
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return NextResponse.json({ error: "Falha ao criar", details: error }, { status: 500 });
    }
}