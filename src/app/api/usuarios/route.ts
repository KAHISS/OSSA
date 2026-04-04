import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
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
            }
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return NextResponse.json({ error: "Falha ao criar usuário" }, { status: 500 });
    }
}