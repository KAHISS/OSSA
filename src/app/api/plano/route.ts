

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// listar plano
export async function GET(){
    const plano = await prisma.plan.findMany();
    return NextResponse.json(plano);
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        if (!data.name || !data.price) {
            return NextResponse.json(
                { error: 'Campos obrigatórios faltando' },
                { status: 400 }
            );
        }
        
        const plano = await prisma.plan.create({
            data: {
                name: data.name,
                price: data.price,
                description: data.description,
            },
        })
        return NextResponse.json(plano, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Erro ao criar plano' + error },
            { status: 500 }
        );
    }
}